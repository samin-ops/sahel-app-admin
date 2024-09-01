import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from 'src/app/shared/models/product';
import { ProductDto } from 'src/app/shared/dtos/responses/products/product.dto';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  public editorContent!: string;
  private description!: string;

  showCode = false;

  // images: Array<File> = [];
  images!: FileList;

  productForm!: FormGroup;
  constructor(
    private router: Router,
    private productS: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.minLength(4)]],
      price: [1, [Validators.required, Validators.min(1)]],
      stock: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onDataChanged(content: any) {
    this.description = content;
  }

  addFiles(e: any) {
    this.images = <FileList>e.target.files;
  }
  submitForm() {
    const productInfo = this.productForm.value
    this.productS.createProduct(productInfo, this.images).subscribe({
      next: data =>{
        if(data && data.success){
          console.log(data);
          
          this.router.navigateByUrl("/product/list")
        }else{
          this.router.navigateByUrl("/product/create")
        }
      },
      error: err => {
        console.log(err);
        
      }
    })
      
    
      
  }
}
