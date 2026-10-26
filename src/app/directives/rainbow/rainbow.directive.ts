import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow], textarea[appRainbow]',
  host: {
    '[style.color]': 'color()',
    '[style.border-color]': 'color()',
    '(keyup)': 'changeColor()',
  },
})
export class RainbowDirective {
  color = signal(this.randomHexColor());

  changeColor(): void {
    this.color.set(this.randomHexColor());
  }

  private randomHexColor(): string {
    const value = Math.floor(Math.random() * 0x1000000);
    return '#' + value.toString(16).padStart(6, '0');
  }
}
