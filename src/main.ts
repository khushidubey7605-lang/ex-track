import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// 🔥 Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';

// 📊 Chart.js (FIX for "pie is not a registered controller")
import { Chart, registerables } from 'chart.js';

// ✅ Register ALL chart components (pie, bar, line, etc.)
Chart.register(...registerables);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() =>
      initializeApp(environment.firebaseConfig)
    ),

    provideAuth(() =>
      getAuth()
    ),

    provideFirestore(() =>
      getFirestore()
    )
  ]
}).catch(err => console.error(err));