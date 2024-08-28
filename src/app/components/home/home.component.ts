import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesService } from 'src/app/shared/services/pages.service';
import { Category } from 'src/app/shared/models/category.model';
import { Tag } from 'src/app/shared/models/tag.model';
import { HomeResponseDto } from 'src/app/shared/dtos/responses/pages/home.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categories: Category[];
  tags: Tag[];

  constructor(private pageService: PagesService) {}

  ngOnInit() {
    this.pageService.fetchHome().subscribe((res) => {
      if (res.success) {
        this.tags = (res as HomeResponseDto).tags;
        this.categories = (res as HomeResponseDto).categories;
      }
    });
  }
  
}
