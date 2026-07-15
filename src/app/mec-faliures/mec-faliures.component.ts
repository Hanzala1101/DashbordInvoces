import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SohoDataGridComponent } from 'ids-enterprise-ng';
import { Observable } from 'rxjs';
import { gridOptions } from '../shared/gridOptions';
import { FailuresStore } from '../store/mec-failures.store';
import { EventService } from '../services/event.service';
import { DataService } from '../services/data.service';
import { Events } from '../shared/constants';
import { GlobalStore } from '../store/global-store';

@Component({
  selector: 'app-mec-faliures',
  templateUrl: './mec-faliures.component.html',
  styleUrls: ['./mec-faliures.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MecFaliuresComponent implements AfterViewInit {
  state$!: Observable<any>;

  @ViewChild(SohoDataGridComponent) dataGrid!: SohoDataGridComponent;

  gridOptions = new gridOptions().mecFailureGridOptions;

  constructor(
    private store: FailuresStore,
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
      this.dataService.listMecError(selectedDate).subscribe((data: any) => {
        this.store.setItems(data.items);
      });
    }
}
