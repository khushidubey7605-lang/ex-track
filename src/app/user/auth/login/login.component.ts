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

  // ngModel bindings
  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async login(form: NgForm) {
    this.submitted = true;

    if (!form.valid) {
      return;
    }

    try {
      await this.auth.login(this.email, this.password);

      alert('Login successful 🎉');
      this.router.navigate(['/dashboard']);

    } catch (err: any) {

      // ✅ User-friendly Firebase error handling
      if (err.code === 'auth/user-not-found') {
        alert('User not found. Please signup first.');
      } else if (err.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-credential') {
        alert('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        alert('Too many attempts. Please try again later.');
      } else {
        alert(err.message);
      }

    }
  }
}
