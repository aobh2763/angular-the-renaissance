import { Component } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent {
  /* 
  cvs: Cv[] = [];
  selectedCv: Cv | null = null;
  */

  date = new Date();
  cvs$: Observable<Cv[]>;
  selectedCv$: Observable<Cv | null>;

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    /*
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs = cvs;
      },
      error: () => {
        this.cvs = this.cvService.getFakeCvs();
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
    */
   
    this.cvs$ = this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error(
          "Erreur lors du chargement des CVs. Affichage des CVs fictifs.",
        );
        return of(this.cvService.getFakeCvs());
      })
    );
    this.selectedCv$ = this.cvService.selectCv$;

    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}