import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="center">
      <img src="#" />
      <h1>Hey, cette page n'existe pas !</h1>
      <button routerLink="/">Retourner à l' accueil</button>
    </div>
  `,
})
export class PageNotFoundComponent {}
