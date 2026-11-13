import { Component, inject, output } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);

  selectedCvs = output<Cv[]>();

  form = this.formBuilder.group({ search: [''] });

  get search(): AbstractControl {
    return this.form.get('search')!;
  }

  cvs$ = this.search.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((name) => this.cvService.selectByName(name ?? '')),
    tap(cvs => {
  console.log("Résultat API :", cvs);
  this.selectedCvs.emit(cvs);
}))
  .subscribe();
}
