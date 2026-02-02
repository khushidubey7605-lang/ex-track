import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '@angular/fire/firestore';

export interface CurrentUser {
  uid: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'pending';
  phone?: string;
  city?: string;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ✅ Angular DI-safe injection
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private currentUser: CurrentUser | null = null;

  public userChanges = new BehaviorSubject<CurrentUser | null>(null);

  constructor() {
    // ✅ AngularFire-safe auth state listener
    authState(this.auth).subscribe(async (user: User | null) => {
      if (!user) {
        this.currentUser = null;
        this.userChanges.next(null);
        return;
      }

      const snap = await getDoc(
        doc(this.firestore, 'users', user.uid)
      );

      if (snap.exists()) {
        const d: any = snap.data();
        this.currentUser = {
          uid: d.uid,
          name: d.name,
          role: d.role,
          status: d.status,
          phone: d.phone,
          city: d.city,
          gender: d.gender
        };
        this.userChanges.next(this.currentUser);
      }
    });
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  getUsername(): string | null {
    return this.currentUser?.name || null;
  }

  // 🔹 Register user
  async register(
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
    extraData?: { phone?: string; city?: string; gender?: string }
  ) {
    const res = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const uid = res.user.uid;
    const status = role === 'admin' ? 'pending' : 'active';

    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      name,
      email,
      role,
      status,
      phone: extraData?.phone || '',
      city: extraData?.city || '',
      gender: extraData?.gender || '',
      createdAt: serverTimestamp()
    });

    return res.user;
  }

  // 🔹 Login user
  async login(email: string, password: string): Promise<CurrentUser> {
    const res = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const snap = await getDoc(
      doc(this.firestore, 'users', res.user.uid)
    );

    if (!snap.exists()) {
      await signOut(this.auth);
      throw new Error('User data not found');
    }

    const d: any = snap.data();

    if (d.role === 'admin' && d.status !== 'active') {
      await signOut(this.auth);
      throw new Error('Admin approval pending');
    }

    this.currentUser = {
      uid: d.uid,
      name: d.name,
      role: d.role,
      status: d.status,
      phone: d.phone,
      city: d.city,
      gender: d.gender
    };

    this.userChanges.next(this.currentUser);
    return this.currentUser;
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser = null;
    this.userChanges.next(null);
  }
}
