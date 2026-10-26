import { Component, inject, ChangeDetectionStrategy, debounced, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { CvService } from "../services/cv.service";
import { ItemComponent } from "../item/item.component";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ItemComponent]
})
export class AutocompleteComponent {
  private cvService = inject(CvService);

  query = signal("");
  debouncedQuery = debounced(this.query, 300);
  results = rxResource({
    params: () => this.debouncedQuery.value().trim() || undefined,
    defaultValue: [],
    stream: ({ params }) => this.cvService.selectByName(params),
  });

  onSearchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
