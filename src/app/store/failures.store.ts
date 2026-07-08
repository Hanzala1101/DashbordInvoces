import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Failure } from './app-store.state';

export interface FailuresState {
   failures: Failure[];
}

export const initialFailuresState: FailuresState = {
   failures: [
      { id: 1, metric: 'Total Invoices' },
      { id: 2, metric: 'Processed' },
      { id: 3, metric: 'Failed' },
      { id: 4, metric: 'Pending' },
      { id: 5, metric: 'Revenue' }
   ]
};

@Injectable({
   providedIn: 'root'
})
export class FailuresStore {
   private readonly stateSubject = new BehaviorSubject<FailuresState>(initialFailuresState);
   readonly state$ = this.stateSubject.asObservable();

   readonly failures$ = this.select(state => state.failures);

   constructor() { }

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
}
