import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() username: string | null = null;

  isLogoutActive = false; // 🔥 NEW FLAG

  constructor(private authService: AuthService) {}

//  isLogoutActive = false;

logout() {
  this.isLogoutActive = true;

  const confirmLogout = window.confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    this.authService.logout();
  } else {
    this.isLogoutActive = false;
  }
}

}
