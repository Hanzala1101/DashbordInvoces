import { AfterViewInit, Component } from '@angular/core';
import { InvoiceStore } from '../store/invoice.store';

@Component({
   selector: 'app-monitoring',
   templateUrl: './monitoring.component.html',
   styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements AfterViewInit {
   selcompleted = 1;
   seltotal = 1;
   mrocompleted = 1;
   mrototal = 1;
   radius = 48;

   constructor(private invoiceStore: InvoiceStore) {
      this.invoiceStore = invoiceStore;
   }

   ngAfterViewInit(): void {
      this.invoiceStore.state$.subscribe((state) => {
         this.seltotal = state?.data?.length || 0;

         this.calculateCompleted(state?.data || []);
      })
   }

   calculateCompleted(data: any[]): void {
      this.selcompleted = data.filter((item: any) => item?.INST > 75).length;
   }

   get percentage(): number {
      return Math.round((this.selcompleted / this.seltotal) * 100);
   }

   get circumference(): number {
      return 2 * Math.PI * this.radius;
   }

   get strokeOffset(): number {
      return this.circumference - (this.percentage / 100) * this.circumference;
   }
}
