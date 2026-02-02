import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';

/**
 * ✅ Profile-specific model
 * (username yahin hona chahiye)
 */
interface ProfileUser {
  uid: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'pending';
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: ProfileUser = {
    uid: '',
    name: '',
    email: '',
    username: '',
    phone: '',
    role: 'user',
    status: 'active'
  };

  loading = false;
  successMessage = '';
  private userSub!: Subscription;

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    // Initial load
    const current: any = this.authService.getCurrentUser();
    if (current) {
      this.user = { ...this.user, ...current };
    }

    // Live sync
    this.userSub = this.authService.userChanges.subscribe((currentUser: any) => {
      if (currentUser) {
        this.user = { ...this.user, ...currentUser };
      }
    });
  }

  async updateProfile(): Promise<void> {
    if (!this.user.uid) {
      this.successMessage = 'UID missing. Cannot update profile.';
      return;
    }

    this.loading = true;
    this.successMessage = '';

    try {
      await updateDoc(
        doc(this.firestore, 'users', this.user.uid),
        {
          name: this.user.name,
          username: this.user.username,
          phone: this.user.phone || ''
        }
      );

      this.successMessage = 'Profile updated successfully ✅';
    } catch (err) {
      console.error(err);
      this.successMessage = 'Profile update failed ❌';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
