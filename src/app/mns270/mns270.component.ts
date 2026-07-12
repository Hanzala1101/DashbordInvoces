import {
  Component,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { finalize, forkJoin, mergeMap, Observable, Subscription } from 'rxjs';
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
    this.dataService
      .fetchJobs(selectedDate)
      .pipe(finalize(() => this.store.setBusy(false)))
      .subscribe((jobs) => {
        this.getInvoiceandJob(jobs);
      });
  }

  getInvoiceandJob(items: any): void {
    items.items.forEach((item: any) => {
      const jobNo = item.C4BJNO;
      this.dataService
        .fetchMNS270(jobNo)
        .pipe(finalize(() => this.store.setBusy(false)))
        .subscribe({
          next: (data: any) => {
            this.store.setItems(data.items);
          },
        });
    });
  }
}
