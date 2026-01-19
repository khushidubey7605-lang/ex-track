import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // 🔐 REGISTER (User / Admin)
  async register(
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
    extraData?: { phone?: string; city?: string; gender?: string }
  ): Promise<UserCredential> {

    // ✅ Create account in Firebase Auth
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = res.user.uid;

    // ✅ Admin → pending | User → active
    const status = role === 'admin' ? 'pending' : 'active';

    // ✅ Save user info in Firestore
    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      name,
      email,
      role,
      status,
      phone: extraData?.phone || '',
      city: extraData?.city || '',
      gender: extraData?.gender || '',
      createdAt: serverTimestamp() // ✅ Firestore server timestamp
    });

    return res; // ✅ Return UserCredential so component can access user.uid
  }

  // 🔑 LOGIN (Role + Status check)
  async login(email: string, password: string): Promise<any> {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = res.user.uid;

    const userSnap = await getDoc(doc(this.firestore, 'users', uid));

    if (!userSnap.exists()) {
      await signOut(this.auth);
      throw new Error('User data not found');
    }

    const userData: any = userSnap.data();

    // ❌ Admin pending → block login
    if (userData.role === 'admin' && userData.status !== 'active') {
      await signOut(this.auth);
      throw new Error('Admin approval pending');
    }

    return userData; // 👈 role & info components ko milega
  }

  // 🚪 LOGOUT
  logout() {
    return signOut(this.auth);
  }
}
