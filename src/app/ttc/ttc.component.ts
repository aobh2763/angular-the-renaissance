import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import{DecimalPipe} from '@angular/common'

@Component({
  selector: 'app-ttc',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './ttc.component.html',
  styleUrl: './ttc.component.css',
})
export class TtcComponent {
  prix_ht = signal<number>(0);
  tva = signal<number>(18);
  quantity = signal<number>(1);

  discount = computed(() => {
    if (this.quantity() >= 10 && this.quantity() <= 15) {
      return 0.2;
    }
    if (this.quantity() > 15) {
      return 0.3;
    }
    return 0;
  });

  prix_unitaire_ttc = computed(() => this.prix_ht() * (1 + this.tva() / 100));

  prix_total_ttc = computed(
    () => this.prix_unitaire_ttc() * this.quantity() * (1 - this.discount()),
  );
}
