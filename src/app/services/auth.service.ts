import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

export interface CurrentUser {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'pending';
  phone?: string;
  city?: string;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: CurrentUser | null = null;
  userChanges = new BehaviorSubject<CurrentUser | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.ngZone.run(async () => {

        if (!user) {
          this.currentUser = null;
          this.userChanges.next(null);
          return;
        }

        const snap = await getDoc(
          doc(this.firestore, 'users', user.uid)
        );

        if (!snap.exists()) return;

        const d: any = snap.data();

        this.currentUser = {
          uid: user.uid,
          name: d.name,
          email: d.email,
          role: d.role,
          status: d.status,
          phone: d.phone,
          city: d.city,
          gender: d.gender
        };

        this.userChanges.next(this.currentUser);
      });
    });
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  getUsername(): string | null {
    return this.currentUser?.name || null;
  }

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
      uid: res.user.uid,
      name: d.name,
      email: d.email,
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
    this.router.navigate(['/login']);
  }
}
