import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { InvoiceStore } from '../store/invoice.store';
import { Invoice } from '../store/app-store.state';
import { DataService } from '../services/data.service';
import { AppStoreService } from '../store/app-store.service';

@Component({
   selector: 'app-invoice-genrated',
   templateUrl: './invoice-genrated.component.html',
   styleUrls: ['./invoice-genrated.component.css']
})
export class InvoiceGenratedComponent {
   activeMenuId: string | null = null;
   invoices$: Observable<Invoice[]>;

   private subscriptions = new Subscription();

   constructor(
      private invoiceStore: InvoiceStore,
      private dataService: DataService,
      private appStore: AppStoreService
   ) {
      this.invoices$ = this.invoiceStore.invoices$;
   }

   ngOnInit(): void {
      // const curDate = this.appStore.getSelectedDate();
   }

   ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
   }

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Invoices card action selected:', action);
      this.activeMenuId = null;
   }



}
