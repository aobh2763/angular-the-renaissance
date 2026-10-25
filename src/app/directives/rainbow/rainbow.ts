import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow] textarea[appRainbow]',
})
export class Rainbow {
  @HostBinding('style.color') color: string = '#000000';
  @HostBinding('style.border-color') borderColor: string = '#ffffff';

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  @HostListener('keyup') OnKeyUp() {
    this.color = this.getRandomColor();
    this.borderColor = this.getRandomColor();
  }

  constructor() { }

}
