import { Component } from '@angular/core';
import { RainbowDirective } from '../../directives/rainbow/rainbow.directive';

@Component({
  selector: 'app-rainbow-input',
  imports: [RainbowDirective],
  templateUrl: './rainbow.component.html',
  styleUrl: './rainbow.component.css',
})
export class RainbowInputComponent {}
