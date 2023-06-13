import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { categories } from 'enums/categories.enum';
import { priceTypes } from 'enums/price-types.enum';
import { districts } from 'enums/districts.enum';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Photo {
  url: string;
  file: File;
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent {
  isLoading = false;
  postFormControl!: FormGroup;
  categories = categories.sort((a, b) => a.name.localeCompare(b.name));
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
  constructor(private userAuth: UserAuth, private jobService: JobService, private _snackBar: MatSnackBar) {
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
  createPost(): void {
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
      '',
      this.deliveryTimeFormControl.value ?? '',
    );

    const filteredJobAd = JSON.parse(JSON.stringify(jobAd));

    for (const key in filteredJobAd) {
      if (filteredJobAd[key] === '' || filteredJobAd[key] === null || filteredJobAd[key] === undefined) {
        delete filteredJobAd[key];
      }
    }

    this.jobService.CreateJobAd(filteredJobAd, photos).subscribe(
      (response) => {
        if (response?.statusCode === 201) {
          this.isLoading = false;
          this.openSnackBar("Anúncio criado com sucesso!", "OK", "snackbar-success");
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.openSnackBar("Ocorreu um erro ao anunciar o serviço!", "OK", "snackbar-error");
      }
    );
  }
}
