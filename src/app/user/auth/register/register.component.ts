import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  submitted = false;

  name = '';
  email = '';
  role: 'user' | 'admin' | '' = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async register(form: NgForm) {
    this.submitted = true;

    if (!form.valid) return;

    if (this.password !== this.confirmPassword) {
      return;
    }

    try {
      await this.auth.register(
        this.name,
        this.email,
        this.password,
        this.role as 'user' | 'admin'
      );

      if (this.role === 'user') {
        alert('User registered successfully!');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Admin request sent for approval!');
        this.router.navigate(['/login']);
      }

      form.resetForm();
      this.submitted = false;

    } catch (err: any) {
      alert(err.message || 'Registration failed');
    }
  }
}
