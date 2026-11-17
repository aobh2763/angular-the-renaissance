import { Component, ChangeDetectionStrategy, computed, inject } from "@angular/core";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
import { catchError, of } from "rxjs";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { EmbaucheService } from "../services/embauche.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ListComponent, CvCardComponent, EmbaucheComponent, UpperCasePipe, DatePipe, AutocompleteComponent]
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  cvs = rxResource({
    defaultValue: [] as Cv[],
    stream: () =>
      this.cvService.getCvs().pipe(
        catchError(() => {
          this.toastr.error(`
            Attention!! Les données sont fictives, problème avec le serveur.
            Veuillez contacter l'admin.`);
          return of(this.cvService.getFakeCvs());
        })
      ),
  });

  // Used as the @defer trigger: load <app-embauche> only once someone is hired
  private embauchees = inject(EmbaucheService).embauchees;
  hasEmbauchees = computed(() => this.embauchees().length > 0);
  selectedCv = toSignal(this.cvService.selectCv$, { initialValue: null });
  date = new Date();

  constructor() {
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}