import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceStore } from '../store/invoice.store';
import { Invoice } from '../store/app-store.state';

@Component({
   selector: 'app-invoice-genrated',
   templateUrl: './invoice-genrated.component.html',
   styleUrl: './invoice-genrated.component.css'
})
export class InvoiceGenratedComponent {
   activeMenuId: string | null = null;
   invoices$: Observable<Invoice[]>;

   constructor(private invoiceStore: InvoiceStore) {
      this.invoices$ = this.invoiceStore.invoices$;
   }

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Invoices card action selected:', action);
      this.activeMenuId = null;
   }
}
