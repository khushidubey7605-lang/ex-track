import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async getProfile() {
    const user = this.auth.currentUser;
    if (!user) return null;

    const ref = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data() : null;
  }

  async updateProfile(data: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const ref = doc(this.firestore, 'users', user.uid);
    return updateDoc(ref, data);
  }
}
