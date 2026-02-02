export interface User {
  uid: string;
  name: string;
  email: string;
  username?: string;   // optional if not always present
  phone?: string;      // optional
  role: 'user' | 'admin';
  status: 'active' | 'pending';
  city?: string;
  gender?: string;
}
