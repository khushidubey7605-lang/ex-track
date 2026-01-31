import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  confirm() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
