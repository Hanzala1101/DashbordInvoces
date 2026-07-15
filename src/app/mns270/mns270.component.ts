import {
   Component,
   AfterViewInit,
   ViewChild,
   ChangeDetectionStrategy,
} from '@angular/core';
import { finalize, forkJoin, Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobsStore } from '../store/mns270.store';
import { DataService } from '../services/data.service';
import { SohoDataGridComponent } from 'ids-enterprise-ng';
import { gridOptions } from '../shared/gridOptions';
import { EventService } from '../services/event.service';
import { Events } from '../shared/constants';
import { GlobalStore } from '../store/global-store';
import { IMIResponse } from '@infor-up/m3-odin';

@Component({
   selector: 'app-mns270',
   templateUrl: './mns270.component.html',
   styleUrls: ['./mns270.component.css'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MNS270Component implements AfterViewInit {
   state$!: Observable<any>;

   @ViewChild(SohoDataGridComponent) dataGrid!: SohoDataGridComponent;

   gridOptions = new gridOptions().mnS270GridOptions;
   constructor(
      private store: JobsStore,
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
      this.store.setBusy(true);
      this.dataService.fetchMNS270(selectedDate).subscribe({
         next: (data: any) => {
            const items = Array.isArray(data?.items) ? data.items : [];
            if (!items.length) {
               this.store.setItems([]);
               this.store.setBusy(false);
               return;
            }

            const rowRequests: any[] = items.map((item: any) =>
               forkJoin({
                  status: this.dataService.fetchJobs(item.UUID),
                  idm: this.dataService.fetchIdmXml(item.IVNO),
               }).pipe(
                  map(({ status, idm }) => (
                     console.log('Row details:', idm?.body?.item?.resrs?.res[0]?.url.replace(/\\/g, '')),
                     {
                        C4SSTA: status?.item?.C4SSTA || 'Unknown',
                        FINA: idm?.body?.item?.filename || 'N/A',
                        LINK: idm?.body?.item?.resrs?.res[0]?.url.replace(/\\/g, '') || 'N/A',
                     })),
               ),
            );

            forkJoin(rowRequests).subscribe({
               next: (rowResults: any[]) => {
                  const updatedItems = items.map((item: any, index: number) => ({
                     ...item,
                     ...rowResults[index],
                  }));
                  this.store.setItems(updatedItems);
                  this.store.setBusy(false);
               },
               error: (error) => {
                  console.error('Failed to fetch row details:', error);
                  this.store.setItems(items);
                  this.store.setBusy(false);
               },
            });
         },
         error: (error) => {
            console.error('Failed to fetch MNS270 rows:', error);
            this.store.setItems([]);
            this.store.setBusy(false);
         },
      });
   }
}
