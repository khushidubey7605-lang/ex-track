import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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

  isLogoutActive = false;

  // Inject Router for redirection
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.isLogoutActive = true;

    const confirmLogout = window.confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      this.authService.logout();         // Perform logout
      this.router.navigate(['/register']); // Redirect to register page
    } else {
      this.isLogoutActive = false;
    }
  }
}
