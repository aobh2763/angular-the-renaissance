import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

const PageSize = 12;
@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  /* Todo : Faire le nécessaire pour créer le flux des produits à afficher */
  /* Tips : vous pouvez voir les différents imports non utilisés et vous en inspirer */
  private settings$ = new BehaviorSubject<Settings>({
    limit: PageSize,
    skip: 0,
  });
  products$!: Observable<Product[]>;
  constructor(private productService: ProductService) {
    this.products$ = this.settings$.pipe(
      concatMap((settings) => this.productService.getProducts(settings)),
      takeWhile((res) => res.skip + res.products.length < res.total, true),
      map((res) => res.products),
      scan((all, page) => [...all, ...page], [] as Product[])
    );
  }
   moreProducts(): void {
    const { limit, skip } = this.settings$.value;
    this.settings$.next({ limit, skip: skip + limit });
  }
}
