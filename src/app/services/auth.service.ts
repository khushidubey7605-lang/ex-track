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
  private currentUser: { name: string; role: string; uid: string } | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
    extraData?: { phone?: string; city?: string; gender?: string }
  ): Promise<UserCredential> {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
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

    return res;
  }

  async login(email: string, password: string): Promise<any> {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = res.user.uid;

    const userSnap = await getDoc(doc(this.firestore, 'users', uid));
    if (!userSnap.exists()) {
      await signOut(this.auth);
      throw new Error('User data not found');
    }

    const userData: any = userSnap.data();

    if (userData.role === 'admin' && userData.status !== 'active') {
      await signOut(this.auth);
      throw new Error('Admin approval pending');
    }

    this.currentUser = {
      name: userData.name,
      role: userData.role,
      uid: userData.uid
    };

    return userData;
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser = null;
  }

  getUsername(): string | null {
    return this.currentUser ? this.currentUser.name : null;
  }

  getCurrentUser(): { name: string; role: string; uid: string } | null {
    return this.currentUser;
  }
}
