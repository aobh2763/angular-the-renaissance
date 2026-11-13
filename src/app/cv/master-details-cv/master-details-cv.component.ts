import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ListComponent, RouterOutlet],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  cvs = rxResource({
    defaultValue: [] as Cv[],
    stream: () =>
      this.cvService.getCvs().pipe(
        catchError(() => {
          this.toastr.error(
            "Attention!! Les données sont fictives, problème avec le serveur. Veuillez contacter l'admin.",
          );
          return of(this.cvService.getFakeCvs());
        }),
      ),
  });

  showDetails(cv: Cv): void {
    void this.router.navigate([cv.id], { relativeTo: this.route });
  }
}
