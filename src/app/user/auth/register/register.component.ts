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

  name = '';
  gender = '';
  email = '';
  phone = '';
  city = '';
  role: 'user' | 'admin' | '' = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService, 
    private router: Router
  ) {}

  async register(form: NgForm) {
    if (!form.valid) return;

    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // ✅ Register user with extraData
      const userCredential = await this.auth.register(
        this.name,
        this.email,
        this.password,
        this.role as 'user' | 'admin',
        {
          phone: this.phone,
          city: this.city,
          gender: this.gender
        }
      );

      alert('Registered Successfully');
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert(err.message);
    }
  }
}
