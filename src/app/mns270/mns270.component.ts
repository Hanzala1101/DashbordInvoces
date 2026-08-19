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

    forkJoin({
      ois199: this.dataService.fetchMNS270(selectedDate, 'OIS199PF'),
      cos184: this.dataService.fetchMNS270(selectedDate, 'COS184PF'),
    })
      .pipe(finalize(() => this.store.setBusy(false)))
      .subscribe({
        next: ({ ois199, cos184 }) => {
          // Merge items from both APIs
          const normalize = (val: any) => {
            if (Array.isArray(val)) return val;
            if (val && Array.isArray(val.items)) return val.items;
            return [];
          };

          const items = [
            ...normalize(ois199),
            ...normalize(cos184),
          ];

          if (!items.length) {
            this.store.setItems([]);
            return;
          }

          const enrichedItems = items
            .filter((item: any) => item?.UUID && item.UUID.length < 19)
            .map((item: any) => ({ ...item }));

          const rowRequests = enrichedItems.map((item: any) =>
            forkJoin({
              status: this.dataService.fetchFiles(item.UUID, item.PRTF),
              idm: this.dataService.fetchIdmXml(item.IVNO, item.PRTF),
            }).pipe(
              map(({ status, idm }) => ({
                ...item,
                C4SSTA: status?.item?.CXSSTA || 'Unknown',
                FINA:
                  //status?.item?.CXEMSG || idm?.body?.item?.filename || 'Not found',
                  status?.item?.CMEMSG?.trim() ? 'IDM Integration error : '+ status?.item?.CMEMSG?.trim() : (idm?.body?.item?.filename || 'IDM Integration error : File not found'),
                LINK:
                  idm?.body?.item?.resrs?.res?.[0]?.url?.replace(/\\/g, '') ||
                  'file not found',
              })),
            ),
          );

          forkJoin(rowRequests).subscribe({
            next: (updatedItems) => {
              this.store.setItems(updatedItems);
            },
            error: (err) => {
              console.error('Failed to fetch row details:', err);
              this.store.setItems(enrichedItems);
            },
          });
        },
        error: (err) => {
          console.error('Failed to fetch MNS270 data:', err);
          this.store.setItems([]);
        },
      });
  }
}
