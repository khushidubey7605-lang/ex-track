import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  register(email: string, password: string, name: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(res => {
        const uid = res.user.uid;
        return setDoc(doc(this.firestore, 'users', uid), {
          name,
          email,
          status: 'active',
          role: 'user',
          createdAt: new Date()
        });
      });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
