import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { categories } from 'enums/categories.enum';
import { priceTypes } from 'enums/price-types.enum';
import { districts } from 'enums/districts.enum';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

interface Photo {
  url: string;
  file: File;
}

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['../create-post/create-post.component.css', './edit-post.component.css']
})
export class EditPostComponent {
  jobId = "";
  isLoading = false;
  isOwnJobAd = false;
  postFormControl!: FormGroup;
  categories = categories;
  priceTypes = priceTypes;
  districts = districts;
  imageControl: FormControl = new FormControl();
  categoryFormControl = new FormControl('', [Validators.required]);
  priceTypesFormControl = new FormControl('', [Validators.required]);
  titleFormControl = new FormControl('', [Validators.required]);
  priceFormControl = new FormControl('', [Validators.required]);
  descriptionFormControl = new FormControl('', [Validators.required]);
  districtsFormControl = new FormControl('', [Validators.required]);
  deliveryTimeFormControl = new FormControl('', [Validators.required]);
  isDisplacementFormControl = new FormControl(false);
  displacementFeeFormControl = new FormControl('', [Validators.required]);
  constructor(private userAuth: UserAuth, private router: Router, private jobService: JobService, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.postFormControl = new FormGroup({
      titleFormControl: this.titleFormControl,
      categoryFormControl: this.categoryFormControl,
      districtsFormControl: this.districtsFormControl,
      priceFormControl: this.priceFormControl,
      priceTypesFormControl: this.priceTypesFormControl,
      descriptionFormControl: this.descriptionFormControl,
    });
  }

  selectedPhotos: Photo[] = [];
  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    this.loadJobInfo();
  }
  verifyIsOwnJobAd(workerId: string) {
    if (this.userAuth.currentUser?.uid == workerId) {
      this.isOwnJobAd = true;
      return true;
    }
    return false;
  }
  loadJobInfo() {
    this.isLoading = true;
    this.jobService.GetById(this.jobId).subscribe(
      (response) => {
        if (!this.verifyIsOwnJobAd(response.job.worker.id)){
          this.isLoading = false;
          return;
        } 
        if (this.titleFormControl) {
          this.titleFormControl.setValue(response.job.title);
        }
        if (this.categoryFormControl) {
          this.categoryFormControl.setValue(response.job.category.id);
        }
        if (this.priceFormControl) {
          this.priceFormControl.setValue(response.job.price);
        }
        if (this.districtsFormControl) {
          this.districtsFormControl.setValue(response.job.district.id);
        }
        if (this.descriptionFormControl) {
          this.descriptionFormControl.setValue(response.job.description);
        }
        if (this.priceTypesFormControl) {
          this.priceTypesFormControl.setValue(response.job.price_type.id);
        }
        if (this.deliveryTimeFormControl) {
          this.deliveryTimeFormControl.setValue(response.job.delivery_time);
        }
        if (this.isDisplacementFormControl) {
          if (response.job.displacement_fee)
            this.isDisplacementFormControl.setValue(true);
          if (this.displacementFeeFormControl)
            this.displacementFeeFormControl.setValue(response.job.displacement_fee);
        }
        if (response.job.media) {
          this.selectedPhotos = response.job.media.map((url: string) => ({ url }));
          this.imageControl.setValue(this.selectedPhotos);
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }


  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      for (let i = 0; i < files.length; i++) {
        const file: File | null = files.item(i);
        const reader = new FileReader();
        if (file) {
          if (!allowedTypes.includes(file.type)) {
            this.openSnackBar("Selecione um arquivo de imagem válido (JPG, PNG ou GIF).", "OK", "snackbar-error");
            return;
          }
          this.imageControl.setValue(file);
          reader.onload = () => {
            const photo: Photo = {
              url: reader.result as string,
              file: file
            };
            if (this.selectedPhotos.length < 4) {
              this.selectedPhotos.push(photo);
            } else {
              this.openSnackBar("São permitidas apenas 4 fotos por anúncio!", "OK", "snackbar-error");
            }
          };
          reader.readAsDataURL(file);
        }
      }
      this.imageControl.setValue(this.selectedPhotos);
    }
  }

  removePhoto(photo: Photo) {
    const index = this.selectedPhotos.indexOf(photo);
    if (index !== -1) {
      this.selectedPhotos.splice(index, 1);
      this.imageControl.setValue(this.selectedPhotos);
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
      panelClass: [className],
    });
  }
  isValidForm(): boolean {
    if (
      this.priceFormControl.valid &&
      this.categoryFormControl.valid &&
      this.priceTypesFormControl.valid &&
      this.districtsFormControl.valid &&
      this.titleFormControl.valid &&
      this.descriptionFormControl.valid
    ) {
      if (this.priceTypesFormControl.value?.toString() === '5')
        if (!this.deliveryTimeFormControl.valid) return false;
      if (this.isDisplacementFormControl.value === true)
        if (!this.displacementFeeFormControl.valid) return false;
      return true;
    }
    return false;
  }
  getLoadedPhotos() {
    const loadedUrls = this.imageControl.value
      .filter((x: any) => x.url.includes('https'))
      .map((x: any) => x.url);
    return loadedUrls;
  }
  editPost(): void {
    if (!this.isValidForm()) {
      this.openSnackBar("Preencha todos os campos corretamente!", "OK", "snackbar-error");
      return;
    }
    this.isLoading = true;
    const user = { name: this.userAuth.currentUser?.displayName, id: this.userAuth.currentUser?.uid };
    const price = parseFloat(this.priceFormControl.value ?? '');
    const displacement_fee = parseFloat(this.displacementFeeFormControl.value ?? '');
    const categoryId = this.categoryFormControl.value ?? '';
    const category = categories.find(cat => cat.id.toString() === categoryId.toString());
    const priceType = priceTypes.find(p => p.id.toString() === this.priceTypesFormControl.value?.toString());
    const district = districts.find(d => d.id.toString() === this.districtsFormControl.value?.toString());
    const photos = this.imageControl.value;

    const jobAd = new JobAdvertisement(
      user,
      this.titleFormControl.value ?? '',
      this.descriptionFormControl.value ?? '',
      category,
      district,
      price,
      priceType,
      displacement_fee ?? 0,
      this.jobId,
      this.deliveryTimeFormControl.value ?? '',
      this.getLoadedPhotos()
    );

    const filteredJobAd = JSON.parse(JSON.stringify(jobAd));

    for (const key in filteredJobAd) {
      if (filteredJobAd[key] === '' || filteredJobAd[key] === null || filteredJobAd[key] === undefined) {
        delete filteredJobAd[key];
      }
    }

    this.jobService.UpdateJobAd(filteredJobAd, photos).subscribe(
      (response) => {
        if (response?.statusCode === 200) {
          this.isLoading = false;
          this.loadJobInfo();
          this.openSnackBar("Anúncio editado com sucesso!", "OK", "snackbar-success");
          this.router.navigate(['/jobs/myjobs']);
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.openSnackBar("Ocorreu um erro ao editar o serviço!", "OK", "snackbar-error");
      }
    );
  }
}
