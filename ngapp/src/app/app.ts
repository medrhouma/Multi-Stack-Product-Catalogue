import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" routerLink="/products">🛍️ Catalogue (Angular)</a>
      </div>
    </nav>
    <main class="container pb-5"><router-outlet /></main>
  `,
})
export class App {}