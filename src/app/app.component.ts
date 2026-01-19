import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { NavbarComponent } from './core/layout/navbar.component'; // Correct path
import { NavbarComponent } from './core/layout/navbar.component/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true, // Using standalone component
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
