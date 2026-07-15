import {
   Component,
   ChangeDetectionStrategy,
   AfterViewInit,
   ViewChild,
} from '@angular/core';
import { finalize, forkJoin, Observable, Subscription } from 'rxjs';
import { InvoiceStore } from '../store/invoice.store';
import { DataService } from '../services/data.service';
import { SohoDataGridComponent } from 'ids-enterprise-ng';
import { gridOptions } from '../shared/gridOptions';
import { EventService } from '../services/event.service';
import { Events } from '../shared/constants';
import { GlobalStore } from '../store/global-store';

@Component({
   selector: 'app-invoice-genrated',
   templateUrl: './invoice-genrated.component.html',
   styleUrls: ['./invoice-genrated.component.css'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceGenratedComponent implements AfterViewInit {
   state$!: Observable<any>;

   @ViewChild(SohoDataGridComponent) dataGrid!: SohoDataGridComponent;

   gridOptions = new gridOptions().invoiceGeneratedGridOptions;

   activeMenuId = '';
   constructor(
      private store: InvoiceStore,
      private eventService: EventService,
      private dataService: DataService,
      private globalStore: GlobalStore,
   ) {
      this.state$ = this.store.state$.pipe();
   }

   ngAfterViewInit(): void {
      /**
       * Setup event subscription
       */
      this.setupEvents();
   }

   /**
    * Subscribe to events
    */
   setupEvents(): void {
      // Reset fields when a record in selected in MMS025
      this.eventService.on(Events.dateSelected, () => {
         this.store.reset();
      });

      // Populate fields when a warehouse is selected
      this.eventService.on(Events.dateSelected, () => {
         this.populateList();
      });
   }

   populateList(): void {
      const selectedDate = this.globalStore.date;
      const selectedCONO = this.globalStore.userContext?.currentCompany;

      if (selectedDate) {
         this.store.setBusy(true);

         forkJoin({
            primary: this.dataService.fetchInvoiceData(selectedCONO, selectedDate),
            secondary: this.dataService.fetchInvoiceData2(selectedCONO, selectedDate),
         })
            .pipe(finalize(() => this.store.setBusy(false)))
            .subscribe({
               next: ({ primary, secondary }) => {
                  const primaryItems = Array.isArray(primary?.items) ? primary.items : [];
                  const secondaryItems = Array.isArray(secondary?.items) ? secondary.items : [];
                  const enrichedPrimaryItems = primaryItems.map((item: any) => ({
                     ...item,
                     PRTF: 'OIS199PF',
                  }));
                  const enrichedSecondaryItems = secondaryItems.map((item: any) => ({
                     ...item,
                     PRTF: 'COS184PF',
                  }));
                  this.store.setItems([...enrichedPrimaryItems, ...enrichedSecondaryItems]);
               },
            });
      }
   }

   toggleMenu(menuId: string): void {
      const menuElement = document.getElementById(menuId);
      if (menuElement) {
         const menu = (menuElement as any).sohoMenu;
         if (menu) {
            menu.toggle();
         }
      }
   }

   handleAction(action: string): void {
      switch (action) {
         case 'export':
            // this.exportData();
            break;
         default:
            console.warn(`Unhandled action: ${action}`);
      }
   }
}
