import { Component } from '@angular/core';

@Component({
  selector: 'app-sdet-component',
  templateUrl: './sdet.component.html'
})
export class SdetComponent {
  public currentCount = 0;

  public incrementSdet() {
    this.currentCount++;
  }
}
