import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, finalize } from 'rxjs/operators';
import { Failure } from './app-store.state';
import { DataService } from '../services/data.service';

export interface FailuresState {
   failures: Failure[];
   isBusy: boolean;
}

export const initialFailuresState: FailuresState = {
   failures: [
      { id: 1, metric: 'Total Invoices' },
      { id: 2, metric: 'Processed' },
      { id: 3, metric: 'Failed' },
      { id: 4, metric: 'Pending' },
      { id: 5, metric: 'Revenue' }
   ],
   isBusy: false
};

@Injectable({
   providedIn: 'root'
})
export class FailuresStore {
   private readonly stateSubject = new BehaviorSubject<FailuresState>(initialFailuresState);
   readonly state$ = this.stateSubject.asObservable();

   readonly failures$ = this.select(state => state.failures);
   readonly isBusy$ = this.select(state => state.isBusy);

   constructor(private dataService: DataService) { }

   private select<T>(project: (state: FailuresState) => T): Observable<T> {
      return this.state$.pipe(map(project), distinctUntilChanged());
   }

   private updateState(patch: Partial<FailuresState>): void {
      this.stateSubject.next({
         ...this.stateSubject.value,
         ...patch
      });
   }

   setFailures(failures: Failure[]): void {
      this.updateState({ failures });
   }

   setBusy(isBusy: boolean): void {
      this.updateState({ isBusy });
   }

   /**
    * Load failures by calling the EXPORTMI endpoint and extracting failures
    */
   loadFailuresData(CONO: string, date: string): Observable<Failure[] | undefined> {
      this.setBusy(true);
      return this.dataService.fetchInvoiceData(CONO, date).pipe(
         map(data => {
            if (data.failures) this.setFailures(data.failures);
            return data.failures;
         }),
         finalize(() => this.setBusy(false))
      );
   }
}
