import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  category = [
    'Employer du Batiment',
    'Location Engins',
    'Achat nourriture',
    'Telephone',
    'Meuble',
  ];
  imagePreview: string = '';

  constructor(private bulder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.productForm.setValue({
      name: 'Orange',
      price: 25,
      picture: '',
      description: 'Un bon fruit pour la sante',
      category: 'Meuble',
    });
    this.saveForm();
  }

  nomFormulaire = 'Saisir les produits';

  productForm: any = this.bulder.group({
    name: this.bulder.control('', Validators.required),
    price: this.bulder.control(0, Validators.required),
    picture: this.bulder.control(''),
    description: this.bulder.control('', Validators.required),
    category: this.bulder.control('', Validators.required),
  });

  saveForm() {
    console.log(this.productForm.value);
  }
  resetForm() {
    this.productForm.reset();
    this.save();
  }

  save() {
    this.router.navigate(['/dashboard']);
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement | any).files[0];
    this.productForm.get('picture')?.patchValue(file);
    this.productForm.get('picture')?.updateValueAndValidity;
    const reader = new FileReader();
    reader.onload = () => {
      if (this.productForm.get('picture')?.valid) {
        this.imagePreview = reader.result as string;
      } else {
        this.imagePreview = '';
      }
    };
    reader.readAsDataURL(file);
  }
}
