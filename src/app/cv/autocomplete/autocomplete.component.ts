import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from "rxjs";
import { CvService } from "../services/cv.service";
import { ItemComponent } from "../item/item.component";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, ItemComponent]
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  form = this.formBuilder.nonNullable.group({ search: "" });
  results = toSignal(
    this.form.controls.search.valueChanges.pipe(
      startWith(this.form.controls.search.value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        term.trim()
          ? this.cvService.selectByName(term).pipe(catchError(() => of([])))
          : of([]),
      ),
    ),
    { initialValue: [] },
  );
}
