import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  async register(name: string, email: string, password: string) {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = res.user.uid;
    await setDoc(doc(this.firestore, 'users', uid), {
      name,
      email,
      role: 'user',
      createdAt: new Date()
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
