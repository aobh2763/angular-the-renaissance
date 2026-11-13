import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
})
export class ItemComponent {
  @Input({ required: true }) cv!: Cv;
  @Input() size = 50;
  constructor(private cvService: CvService, private router: Router) {}

  onSelectCv() {
    // this.cvService.selectCv(this.cv);
    this.router.navigate(["cv", this.cv.id]);
  }
}
