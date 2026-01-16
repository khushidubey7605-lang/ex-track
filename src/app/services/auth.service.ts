import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
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
    role: 'user' | 'admin'
  ) {
    const res = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const uid = res.user.uid;

    // 👇 Admin ke liye pending, User ke liye active
    const status = role === 'admin' ? 'pending' : 'active';

    await setDoc(doc(this.firestore, 'users', uid), {
      name,
      email,
      role,
      status,
      createdAt: new Date()
    });
  }

  // 🔑 LOGIN (Role + Status check)
  async login(email: string, password: string): Promise<any> {
    const res = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const uid = res.user.uid;

    const userSnap = await getDoc(
      doc(this.firestore, 'users', uid)
    );

    if (!userSnap.exists()) {
      throw new Error('User data not found');
    }

    const userData: any = userSnap.data();

    // ❌ Admin pending → logout
    if (userData.role === 'admin' && userData.status !== 'active') {
      await signOut(this.auth);
      throw new Error('Admin approval pending');
    }

    return userData; // 👈 role & status login.component ko milega
  }

  // 🚪 LOGOUT
  logout() {
    return signOut(this.auth);
  }
}
