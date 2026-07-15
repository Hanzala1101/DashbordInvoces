import { AfterViewInit, Component } from '@angular/core';
import { InvoiceStore } from '../store/invoice.store';

@Component({
   selector: 'app-monitoring',
   templateUrl: './monitoring.component.html',
   styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements AfterViewInit {
   completed = 1;
   total = 1;
   radius = 48;

   constructor(private invoiceStore: InvoiceStore) {
      this.invoiceStore = invoiceStore;
   }

   ngAfterViewInit(): void {
      this.invoiceStore.state$.subscribe((state) => {
         this.total = state?.data?.length || 0;

         this.calculateCompleted(state?.data || []);
      })
   }

   calculateCompleted(data: any[]): void {
      this.completed = data.filter((item: any) => item?.INST > 75).length;
   }

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
