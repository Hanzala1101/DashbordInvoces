import { Injectable } from '@angular/core';
import { InvoiceGeneratedFileds, MNS270Fileds } from '../shared/models';
import { Store } from './store';

class InvoiceState {
   data: InvoiceGeneratedFileds[] = [];
   selectedInvoiceId: number | null = null;
   isBusy: boolean = false;
}

@Injectable({
   providedIn: 'root',
})
export class InvoiceStore extends Store<InvoiceState> {
   constructor() {
      super(new InvoiceState());
   }
   reset(): void {
      this.setState({ ...this.state, ...new InvoiceState() });
   }

   clearRowSelection(): void {
      this.setState({ ...this.state });
   }

   setBusy(isBusy: boolean): void {
      this.setState({ ...this.state, isBusy });
   }

   setItems(items: any[]): void {
      items = items.map((item: any) => {
         const [repl = '', inst = ''] = (item.REPL || '').split(',');
         return {
            REPL: repl,
            INST: inst,
            PRTF: item.PRTF,
         };
      });
      this.setState({ ...this.state, data: items, isBusy: false });
   }

}
