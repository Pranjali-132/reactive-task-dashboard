import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';

import { firebaseConfig } from './app/firebase.config';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';   // ✅ ADD THIS

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())   // ✅ REQUIRED FOR LOGIN/REGISTER
  ]
});

console.log('FIREBASE PROJECT:', firebaseConfig.projectId);
