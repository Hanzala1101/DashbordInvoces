import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, finalize } from 'rxjs/operators';
import { Invoice, Stat } from './app-store.state';
import { DataService } from '../services/data.service';

export interface InvoiceState {
   invoices: Invoice[];
   selectedInvoiceId: number | null;
   isBusy: boolean;
}

export const initialInvoiceState: InvoiceState = {
   invoices: [
      { id: 1, number: 'INV-001', status: 'Paid' },
      { id: 2, number: 'INV-002', status: 'Pending' },
      { id: 3, number: 'INV-003', status: 'Overdue' },
      { id: 4, number: 'INV-004', status: 'Paid' },
      { id: 5, number: 'INV-005', status: 'Draft' }
   ],
   selectedInvoiceId: null,
   isBusy: false
};

@Injectable({
   providedIn: 'root'
})
export class InvoiceStore {
   private readonly stateSubject = new BehaviorSubject<InvoiceState>(initialInvoiceState);
   readonly state$ = this.stateSubject.asObservable();

   readonly invoices$ = this.select(state => state.invoices);
   readonly selectedInvoiceId$ = this.select(state => state.selectedInvoiceId);
   readonly isBusy$ = this.select(state => state.isBusy);

   constructor(private dataService: DataService) { }

   private select<T>(project: (state: InvoiceState) => T): Observable<T> {
      return this.state$.pipe(map(project), distinctUntilChanged());
   }

   private updateState(patch: Partial<InvoiceState>): void {
      this.stateSubject.next({
         ...this.stateSubject.value,
         ...patch
      });
   }

   setInvoices(invoices: Invoice[]): void {
      this.updateState({ invoices });
   }

   setBusy(isBusy: boolean): void {
      this.updateState({ isBusy });
   }

   selectInvoice(id: number): void {
      this.updateState({ selectedInvoiceId: id });
   }

   updateInvoiceStatus(id: number, status: string): void {
      const invoices = this.stateSubject.value.invoices.map(invoice =>
         invoice.id === id ? { ...invoice, status } : invoice
      );
      this.setInvoices(invoices);
   }

   loadInvoiceData(CONO: string, date: string): void {
      this.setBusy(true);
      this.dataService.fetchInvoiceData(CONO, date).subscribe(
         (data: any) => {
            let invoices: Invoice[] = [];
            if (data && Array.isArray(data.invoices)) {
               invoices = data.invoices as Invoice[];
            } else if (data && Array.isArray(data.items)) {
               invoices = data.items.map((record: any, idx: number) => ({
                  id: idx + 1,
                  number: record.REPL || record.number || '',
                  status: record.status || 'Pending'
               }));
            }
            this.setInvoices(invoices);
            this.setBusy(false);
         },
         (err) => {
            console.error('Failed to load invoice data:', err);
            this.setBusy(false);
         }
      );
   }

}
