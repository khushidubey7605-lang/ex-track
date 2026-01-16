import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

    if (!form.valid) return;

    try {
      // 🔐 AuthService se login + role data
      const userData = await this.auth.login(this.email, this.password);

      // 🔁 ROLE BASED REDIRECT
      if (userData.role === 'user') {
        this.router.navigate(['/dashboard']);
      }

      else if (userData.role === 'admin') {
        if (userData.status === 'active') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Admin approval pending!');
        }
      }

      else if (userData.role === 'superadmin') {
        this.router.navigate(['/superadmin-dashboard']);
      }

    } catch (err: any) {

      // ✅ Firebase friendly errors
      if (err.code === 'auth/user-not-found') {
        alert('User not found. Please signup first.');
      } else if (err.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else if (err.code === 'auth/invalid-credential') {
        alert('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        alert('Too many attempts. Try again later.');
      } else {
        alert(err.message || 'Login failed');
      }

    }
  }
}
