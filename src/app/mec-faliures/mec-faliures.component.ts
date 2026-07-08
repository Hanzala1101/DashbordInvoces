import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Failure } from '../store/app-store.state';
import { FailuresStore } from '../store/failures.store';

@Component({
   selector: 'app-mec-faliures',
   templateUrl: './mec-faliures.component.html',
   styleUrl: './mec-faliures.component.css'
})
export class MecFaliuresComponent {
   activeMenuId: string | null = null;
   failures$: Observable<Failure[]>;

   constructor(private failuresStore: FailuresStore) {
      this.failures$ = this.failuresStore.failures$;
   }

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Failures card action selected:', action);
      this.activeMenuId = null;
   }
}
