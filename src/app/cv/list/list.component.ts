import { Component, ChangeDetectionStrategy, input, output } from "@angular/core";
import { Cv } from "../model/cv";
import { NgClass } from "@angular/common";
import { ItemComponent } from "../item/item.component";

@Component({
    selector: "app-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass, ItemComponent]
})
export class ListComponent {
  cvs = input<Cv[] | null>([]);
  selectedCv = input<Cv | null>(null);
  selectCv = output<Cv>();

  forwardCvSelection(cv: Cv): void {
    this.selectCv.emit(cv);
  }
}
