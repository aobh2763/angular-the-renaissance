import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appRainbow] textarea[appRainbow]',
  host: {
    '[style.color]': 'color',
    '[style.border-color]': 'borderColor',
    '(keyup)': 'onKeyUp()'
  }
})
export class Rainbow {
  color: string = '#000000';
  borderColor: string = '#ffffff';

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  onKeyUp() {
    this.color = this.getRandomColor();
    this.borderColor = this.getRandomColor();
  }

  constructor() { }

}
