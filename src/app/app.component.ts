import {
   AfterViewInit,
   ChangeDetectionStrategy,
   Component,
} from '@angular/core';
import { CoreBase } from '@infor-up/m3-odin';
import { GlobalStore } from './store/global-store';
import { EventService } from './services/event.service';
import { Events } from './shared/constants';
import { DateUtil } from './shared/utils';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends CoreBase implements AfterViewInit {
   version = 'V 1.4.5';
   state$!: any;
   selectedDateInput = DateUtil.formatDateForInput(new Date());

   constructor(
      private globalstore: GlobalStore,
      private eventService: EventService,
   ) {
      super('AppComponent');
      this.state$ = this.globalstore.state$.pipe();
      this.selectedDateInput = DateUtil.formatDateForInput(this.globalstore.date);

      this.globalstore.state$.subscribe((state: any) => {
         this.selectedDateInput = DateUtil.formatDateForInput(state?.date);
      });
   }

   ngAfterViewInit() {
      this.refreshData();
   }

   refreshData(): void {
      this.selectedDateInput = DateUtil.formatDateForInput(
         this.selectedDateInput || this.globalstore.date || new Date(),
      );
      this.globalstore.setDate(this.selectedDateInput);
      this.eventService.emit(Events.dateSelected, this.selectedDateInput);
   }

   onDateChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      const selectedDate = input?.value || '';

      this.selectedDateInput = selectedDate;
      this.refreshData();
   }
}
