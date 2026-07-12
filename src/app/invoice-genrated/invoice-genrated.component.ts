import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { finalize, Observable, Subscription } from 'rxjs';
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
      this.dataService
        .fetchInvoiceData(selectedCONO, selectedDate)
        .pipe(finalize(() => this.store.setBusy(false)))
        .subscribe({
          next: (data) => {
            this.store.setItems(data.items);
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
