import { AfterViewInit, Component } from '@angular/core';
import { InvoiceStore } from '../store/invoice.store';

@Component({
   selector: 'app-monitoring',
   templateUrl: './monitoring.component.html',
   styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements AfterViewInit {
   selcompleted = 0;
   seltotal = 0;
   mrocompleted = 0;
   mrototal = 0;
   radius = 48;

   constructor(private invoiceStore: InvoiceStore) {
      this.invoiceStore = invoiceStore;
   }

   ngAfterViewInit(): void {
      this.invoiceStore.state$.subscribe((state) => {
         this.seltotal = state?.data?.filter((item: any) => item.PRTF === "OIS199PF").length;
         this.mrototal = state?.data?.filter((item: any) => item.PRTF === "COS184PF").length;

         this.calculateCompleted(state?.data || []);
      })
   }

   calculateCompleted(data: any[]): void {
      this.selcompleted = data.filter((item: any) => item.PRTF === "OIS199PF" && item?.INST > 75).length;
      this.mrocompleted = data.filter((item: any) => item.PRTF === "COS184PF" && item?.INST > 75).length;
   }

   get selpercentage(): number {
      return Math.round((this.selcompleted / this.seltotal) * 100);
   }
   get mropercentage(): number {
      return Math.round((this.mrocompleted / this.seltotal) * 100);
   }

   get circumference(): number {
      return 2 * Math.PI * this.radius;
   }

   get selstrokeOffset(): number {
      return this.circumference - (this.selpercentage / 100) * this.circumference;
   }
   get mrostrokeOffset(): number {
      return this.circumference - (this.mropercentage / 100) * this.circumference;
   }
}
