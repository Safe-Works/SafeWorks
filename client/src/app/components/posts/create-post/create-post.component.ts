import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { categories } from 'enums/categories.enum';
import { priceTypes } from 'enums/price-types.enum';
import { districts } from 'enums/districts.enum';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  isLoading = false;
  postFormControl!: FormGroup;
  categories = categories;
  priceTypes = priceTypes;
  districts = districts;
  categoryFormControl = new FormControl('', [Validators.required]);
  priceTypesFormControl = new FormControl('', [Validators.required]);
  titleFormControl = new FormControl('', [Validators.required]);
  priceFormControl = new FormControl('', [Validators.required]);
  descriptionFormControl = new FormControl('', [Validators.required]);
  districtsFormControl = new FormControl('', [Validators.required]);
  deliveryTimeFormControl = new FormControl('', [Validators.required]);
  isDisplacementFormControl = new FormControl('');
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
      if (this.isDisplacementFormControl.value?.toString() === 'true')
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

    this.jobService.CreateJobAd(filteredJobAd).subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response);
        this.openSnackBar("Anáncio criado com sucesso!", "OK", "snackbar-success");
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.openSnackBar("Ocorreu um erro ao anunciar o serviço!", "OK", "snackbar-error");
      }
    );
  }
}
