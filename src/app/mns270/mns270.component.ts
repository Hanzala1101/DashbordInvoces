import {
   Component,
   AfterViewInit,
   ViewChild,
   ChangeDetectionStrategy,
} from '@angular/core';
import { finalize, forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobsStore } from '../store/mns270.store';
import { DataService } from '../services/data.service';
import { SohoDataGridComponent } from 'ids-enterprise-ng';
import { gridOptions } from '../shared/gridOptions';
import { EventService } from '../services/event.service';
import { Events } from '../shared/constants';
import { GlobalStore } from '../store/global-store';

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

   //   populateList(): void {
   //     const selectedDate = this.globalStore.date;
   //     this.store.setBusy(true);
   //     this.dataService
   //       .fetchJobs(selectedDate)
   //       .pipe(finalize(() => this.store.setBusy(false)))
   //       .subscribe((jobs) => {
   //         this.getInvoiceandJob(jobs);
   //       });
   //   }

   //   getInvoiceandJob(items: any): void {
   //     items.items.forEach((item: any) => {
   //       const jobNo = item.C4BJNO;
   //       this.dataService
   //         .fetchMNS270(jobNo)
   //         .pipe(finalize(() => this.store.setBusy(false)))
   //         .subscribe({
   //           next: (data: any) => {
   //             this.store.addItems(data.items);
   //           },
   //         });
   //     });
   //   }

   populateList(): void {
      const selectedDate = this.globalStore.date;
      this.store.setBusy(true);
      this.dataService.fetchMNS270(selectedDate)
         .pipe(finalize(() => this.store.setBusy(false)))
         .subscribe((data: any) => {
            const items = Array.isArray(data?.items) ? data.items : [];
            if (!items.length) {
               this.store.setItems([]);
               return;
            }

            const statusRequests = items.map((item: any) =>
               this.dataService.fetchJobs(item.UUID).pipe(
                  map((jobData: any) => ({
                     ...item,
                     C4SSTA: jobData?.item?.C4SSTA || 'Unknown',
                  })),
               ),
            );

            forkJoin(statusRequests).subscribe(
               (enrichedItems: any) => {
                  // After statuses are enriched, fetch IDM XML per job to extract Updated By
                  const idmRequests = enrichedItems.map((it: any) => this.dataService.fetchIdmXml(it.UUID));

                  if (!idmRequests.length) {
                     this.store.setItems(enrichedItems);
                     return;
                  }

                  forkJoin(idmRequests).subscribe(
                     (xmlResults: any) => {
                        const parseUpdatedBy = (xml: string) => {
                           if (!xml) { return 'NA'; }
                           // Try common tag variations
                           const patterns = [/<(?:UpdatedBy|updatedBy|updated_by|UPDATEDBY)[^>]*>([^<]+)<\/\s*(?:UpdatedBy|updatedBy|updated_by|UPDATEDBY)\s*>/i];
                           for (const p of patterns) {
                              const m = xml.match(p);
                              if (m && m[1]) { return m[1].trim(); }
                           }
                           // Fallback: try simple regex for >value< pattern of a likely node
                           const fallback = xml.match(/>([^<>\n\r]{1,60})<\/?[A-Za-z0-9:_-]*>/);
                           return fallback ? fallback[1].trim() : 'NA';
                        };

                        enrichedItems.forEach((row: any, idx: number) => {
                           const xml = xmlResults[idx] || '';
                           row.UPDATED_BY = parseUpdatedBy(xml) || 'NA';
                        });

                        this.store.setItems(enrichedItems);
                     },
                     (err) => {
                        console.error('Failed to fetch IDM XML:', err);
                        // If IDM fails, still display enriched items with NA
                        enrichedItems.forEach((row: any) => (row.UPDATED_BY = 'NA'));
                        this.store.setItems(enrichedItems);
                     },
                  );
               },
               (error) => {
                  console.error('Failed to fetch job statuses:', error);
                  this.store.setItems(items);
               },
            );
         });
   }
}
