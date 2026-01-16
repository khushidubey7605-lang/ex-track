import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  submitted = false;

  // 🔹 ngModel bindings
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

    // ❌ Form invalid
    if (!form.valid) return;

    // ❌ Password mismatch
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // 🔐 Firebase + Firestore register
      await this.auth.register(
        this.name,
        this.email,
        this.password,
        this.role as 'user' | 'admin'
      );

      // ✅ Success handling
      if (this.role === 'user') {
        alert('User registered successfully!');
        this.router.navigate(['/user-dashboard']);
      } else {
        alert('Admin registration submitted. Waiting for Super Admin approval.');
        this.router.navigate(['/login']);
      }

      // 🔄 Reset form
      form.resetForm();
      this.submitted = false;

    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    }
  }
}
