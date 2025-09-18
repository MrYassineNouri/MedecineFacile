import { Routes } from '@angular/router';
import { AppBoxedLoginComponent } from './authentication/boxed-login/boxed-login.component'; // adjust the path

export const PagesRoutes: Routes = [
  {
    path: '',
    component: AppBoxedLoginComponent,
    data: {
      title: 'Login',
    },
  },
];
