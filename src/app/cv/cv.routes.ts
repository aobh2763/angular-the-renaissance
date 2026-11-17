import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const CV_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cv/cv.component').then((m) => m.CvComponent),
  },
  {
    path: 'add',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./add-cv/add-cv.component').then((m) => m.AddCvComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./details-cv/details-cv.component').then(
        (m) => m.DetailsCvComponent,
      ),
  },
];
