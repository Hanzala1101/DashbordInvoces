import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Invoice } from './app-store.state';

export interface InvoiceState {
   invoices: Invoice[];
   selectedInvoiceId: number | null;
}

export const initialInvoiceState: InvoiceState = {
   invoices: [
      { id: 1, number: 'INV-001', status: 'Paid' },
      { id: 2, number: 'INV-002', status: 'Pending' },
      { id: 3, number: 'INV-003', status: 'Overdue' },
      { id: 4, number: 'INV-004', status: 'Paid' },
      { id: 5, number: 'INV-005', status: 'Draft' }
   ],
   selectedInvoiceId: null
};

@Injectable({
   providedIn: 'root'
})
export class InvoiceStore {
   private readonly stateSubject = new BehaviorSubject<InvoiceState>(initialInvoiceState);
   readonly state$ = this.stateSubject.asObservable();

   readonly invoices$ = this.select(state => state.invoices);
   readonly selectedInvoiceId$ = this.select(state => state.selectedInvoiceId);

   constructor() { }

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

   selectInvoice(id: number): void {
      this.updateState({ selectedInvoiceId: id });
   }

   updateInvoiceStatus(id: number, status: string): void {
      const invoices = this.stateSubject.value.invoices.map(invoice =>
         invoice.id === id ? { ...invoice, status } : invoice
      );
      this.setInvoices(invoices);
   }
}
