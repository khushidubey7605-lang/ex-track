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

  // ✅ Declare these properties for ngModel binding
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private auth: AuthService, private router: Router) {}

  async register(form: NgForm) {
    this.submitted = true;

    if (!form.valid) return;

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await this.auth.register(this.name, this.email, this.password);
      alert('Registered successfully!');
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert(err.message);
    }
  }
}
