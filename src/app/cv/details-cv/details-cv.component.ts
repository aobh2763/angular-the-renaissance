import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DefaultImagePipe]
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  cv = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
          this.navigateToList();
          return of(null);
        }

        return this.cvService.getCvById(id).pipe(
          catchError(() => {
            this.navigateToList();
            return of(null);
          }),
        );
      }),
    ),
    { initialValue: null },
  );

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.navigateToList();
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }

  private navigateToList(): void {
    if (
      this.activatedRoute.parent?.routeConfig?.path === APP_ROUTES.masterDetail
    ) {
      void this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      return;
    }

    void this.router.navigate([APP_ROUTES.cv]);
  }
}
