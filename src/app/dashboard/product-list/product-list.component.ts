import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSortModule } from '@angular/material/sort';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  photo: string;
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatGridListModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  cards: Product[] = [];
  images = [
    'nature',
    'sky',
    'grass',
    'mountains',
    'rivers',
    'glacier',
    'forest',
    'streams',
    'rain',
    'clouds',
  ];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.images.length; i++) {
      this.cards.push({
        id: `${i + 1}`,
        name: `Card ${i + 1}`,
        price: parseInt(`${i + 1}`),
        description: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. `,
        photo: `https://source.unsplash.com/random/500X500?${this.images[i]}`,
      });
    }
  }
}
