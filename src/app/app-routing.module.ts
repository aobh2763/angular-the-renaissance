import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from './selective-preloading.strategy';
import { FrontComponent } from './templates/front/front.component';
import { LoginComponent } from './auth/login/login.component';
import { NF404Component } from './components/nf404/nf404.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // LAZY + PRELOADED: the core feature, most users go there next
  {
    path: 'cv',
    loadChildren: () => import('./cv/cv.routes').then((m) => m.CV_ROUTES),
    data: { preload: true },
  },
  {
    path: 'masterDetail',
    loadComponent: () =>
      import('./cv/master-details-cv/master-details-cv.component').then(
        (m) => m.MasterDetailsCvComponent,
      ),
    data: { preload: true },
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./cv/details-cv/details-cv.component').then(
            (m) => m.DetailsCvComponent,
          ),
      },
    ],
  },

  // LAZY only (loaded on first visit): secondary / demo pages
  {
    path: 'rh',
    loadComponent: () =>
      import('./optimizationPattern/rh/rh.component').then(
        (m) => m.RhComponent,
      ),
  },
  {
    path: 'rainbow',
    loadComponent: () =>
      import('./components/rainbow/rainbow.component').then(
        (m) => m.RainbowInputComponent,
      ),
  },
  {
    path: 'ttc',
    loadComponent: () =>
      import('./ttc/ttc.component').then((m) => m.TtcComponent),
  },
  {
    path: 'currency-selector',
    loadComponent: () =>
      import('./tp2/currency-selector/country-currency-selector.component').then(
        (m) => m.CountryCurrencySelectorComponent,
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./templates/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: 'color',
        loadComponent: () =>
          import('./components/color/color.component').then(
            (m) => m.ColorComponent,
          ),
      },
    ],
  },

  // HOME shell is eager, its child pages are lazy
  {
    path: '',
    component: FrontComponent,
    children: [
      {
        path: 'todo',
        loadComponent: () =>
          import('./todo/todo/todo.component').then((m) => m.TodoComponent),
      },
      {
        path: 'word',
        loadComponent: () =>
          import('./directives/mini-word/mini-word.component').then(
            (m) => m.MiniWordComponent,
          ),
      },
    ],
  },

  { path: '**', component: NF404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Custom strategy: only preload routes flagged with data: { preload: true }
      preloadingStrategy: SelectivePreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
