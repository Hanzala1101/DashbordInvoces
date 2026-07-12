import { Component } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent {
  completed = 10;
  total = 20;
  radius = 48;

  get percentage(): number {
    return Math.round((this.completed / this.total) * 100);
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get strokeOffset(): number {
    return this.circumference - (this.percentage / 100) * this.circumference;
  }
}
