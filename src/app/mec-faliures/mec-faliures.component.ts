import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Failure } from '../store/app-store.state';
import { FailuresStore } from '../store/failures.store';
import { AppStoreService } from '../store/app-store.service';

@Component({
   selector: 'app-mec-faliures',
   templateUrl: './mec-faliures.component.html',
   styleUrls: ['./mec-faliures.component.css']
})
export class MecFaliuresComponent implements OnInit, OnDestroy {
   activeMenuId: string | null = null;
   failures$: Observable<Failure[]>;
   private subscriptions = new Subscription();

   constructor(private failuresStore: FailuresStore, private appStore: AppStoreService) {
      this.failures$ = this.failuresStore.failures$;
   }

   ngOnInit(): void {
      const curDate = this.appStore.getSelectedDate();
      const CONO = this.appStore.getUserContextSync()?.company || '';
      if (CONO && curDate) {
         this.failuresStore.loadFailuresData(CONO.toString(), curDate).subscribe();
      }

      this.subscriptions.add(
         this.appStore.selectedDateChange$.subscribe((date) => {
            const cono = this.appStore.getUserContextSync()?.company || '';
            if (cono && date) this.failuresStore.loadFailuresData(cono.toString(), date).subscribe();
         })
      );
   }

   ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
   }

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Failures card action selected:', action);
      this.activeMenuId = null;
   }
}
