import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  successMessage = '';
  errorMessage = '';

  changePassword() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (this.currentPassword !== storedUser.password) {
      this.errorMessage = 'Current password is incorrect';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    storedUser.password = this.newPassword;
    localStorage.setItem('user', JSON.stringify(storedUser));

    this.successMessage = 'Password updated successfully!';
    this.errorMessage = '';
  }
}
