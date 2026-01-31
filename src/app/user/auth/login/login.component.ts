import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, CurrentUser } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  submitted = false;
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async login(form: NgForm) {
    this.submitted = true;

    // stop if form invalid
    if (!form.valid) return;

    try {
      const userData: CurrentUser = await this.auth.login(this.email, this.password);

      // Role-based redirect
      if (userData.role === 'user') {
        this.router.navigate(['/dashboard']);
      } else if (userData.role === 'admin') {
        if (userData.status === 'active') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Admin approval pending!');
        }
      } else if (userData.role === 'superadmin') {
        this.router.navigate(['/superadmin-dashboard']);
      }

    } catch (err: any) {
      // Firebase auth errors handling
      switch (err.code) {
        case 'auth/user-not-found':
          alert('User not found. Please signup first.');
          break;
        case 'auth/wrong-password':
          alert('Incorrect password.');
          break;
        case 'auth/invalid-credential':
          alert('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          alert('Too many attempts. Try again later.');
          break;
        default:
          alert(err.message || 'Login failed');
      }
    }
  }
}
