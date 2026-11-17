import { Component, inject, ChangeDetectionStrategy, debounced, signal } from "@angular/core";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
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

  selectedCv = toSignal(this.cvService.selectCv$, { initialValue: null });

  isOpen = signal(false);

  closeDropdown() {
    this.isOpen.set(false);
  }

  query = signal("");
  debouncedQuery = debounced(this.query, 300);
  results = rxResource({
    params: () => this.debouncedQuery.value().trim() || undefined,
    defaultValue: [],
    stream: ({ params }) => this.cvService.selectByName(params),
  });

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.isOpen.set(value.trim().length > 0);
  }
}
