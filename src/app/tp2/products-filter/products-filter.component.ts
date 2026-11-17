import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PRODUCTS } from './product.data';

@Component({
  selector: 'app-products-filter',
  imports: [],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  readonly products = PRODUCTS;
  protected categories = [...new Set(this.products.map((p) => p.category))];

  protected search = signal('');
  protected category = signal('');

  // depends on BOTH search and category -> recomputed when either one changes
  protected filteredProducts = computed(() => {
    const search = this.search().toLowerCase();
    const category = this.category();
    return this.products.filter(
      (p) =>
        (!category || p.category === category) &&
        p.name.toLowerCase().includes(search),
    );
  });


  protected reset() {
    this.search.set('');
    this.category.set('');
  }
}
