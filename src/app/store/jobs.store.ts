import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { Job } from './app-store.state';
import { DataService } from '../services/data.service';

export interface JobsState {
   jobs: Job[];
   isBusy: boolean;
}

export const initialJobsState: JobsState = {
   jobs: [],
   isBusy: false
};

@Injectable({
   providedIn: 'root'
})
export class JobsStore {
   private readonly stateSubject = new BehaviorSubject<JobsState>(initialJobsState);
   readonly state$ = this.stateSubject.asObservable();

   readonly jobs$ = this.select(state => state.jobs);
   readonly isBusy$ = this.select(state => state.isBusy);

   constructor(private dataService: DataService) { }

   private select<T>(project: (state: JobsState) => T): Observable<T> {
      return this.state$.pipe(map(project), distinctUntilChanged());
   }

   private updateState(patch: Partial<JobsState>): void {
      this.stateSubject.next({
         ...this.stateSubject.value,
         ...patch
      });
   }

   setJobs(jobs: Job[]): void {
      this.updateState({ jobs });
   }

   setBusy(isBusy: boolean): void {
      this.updateState({ isBusy });
   }

   /**
    * Load job data from CMS100MI/LstJob API
    * @returns Observable to track loading state
    */
   loadJobsData(): Observable<any[]> {
      this.setBusy(true);
      return this.dataService.fetchJobsData().pipe(
         map(jobs => {
            this.setJobs(jobs);
            return jobs;
         }),
         finalize(() => this.setBusy(false))
      );
   }
}
