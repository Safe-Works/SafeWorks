import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { categories } from 'enums/categories.enum';
import { priceTypes } from 'enums/price-types.enum';
import { districts } from 'enums/districts.enum';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postFormControl!: FormGroup;
  categories = categories;
  priceTypes = priceTypes;
  districts = districts;
  selectedCategory: string;
  categoryFormControl = new FormControl('', [Validators.required]);
  priceTypesFormControl = new FormControl('', [Validators.required]);
  titleFormControl = new FormControl('', [Validators.required]);
  priceFormControl = new FormControl('', [Validators.required]);
  descriptionFormControl = new FormControl('', [Validators.required]);
  districtsFormControl = new FormControl('', [Validators.required]);
  deliveryTimeFormControl = new FormControl('', [Validators.required]);
  isDisplacementFormControl = new FormControl('');
  displacementFeeFormControl = new FormControl('', [Validators.required]);
  constructor() {
    this.selectedCategory = 'Selecione';
    this.postFormControl = new FormGroup({
      categoryFormControl: this.categoryFormControl,
      titleFormControl: this.titleFormControl,
      priceFormControl: this.priceFormControl,
      priceTypesFormControl: this.priceTypesFormControl,
      descriptionFormControl: this.descriptionFormControl,
      districtsFormControl: this.districtsFormControl,
      deliveryTimeFormControl: this.deliveryTimeFormControl,
      displacementFeeFormControl:  this.displacementFeeFormControl,
    });
  }

  createPost(): void {
    const user = { name: 'Teste', id: '' }
    const price = parseFloat(this.priceFormControl.value ?? '');
    const displacement_fee = parseFloat(this.displacementFeeFormControl.value ?? '');

    const jobAd = new JobAdvertisement(
      user,
      this.titleFormControl.value ?? '',
      this.descriptionFormControl.value ?? '',
      this.categoryFormControl.value ?? '',
      this.districtsFormControl.value ?? '',
      price,
      this.priceTypesFormControl.value ?? '',
      displacement_fee ?? 0,
      '',
      this.deliveryTimeFormControl.value ?? '',
    );

  }
}
