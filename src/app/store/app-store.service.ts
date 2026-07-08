import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, finalize, tap } from 'rxjs/operators';
import { AppState, initialAppState, Failure, Invoice, Stat } from './app-store.state';
import type { IUserContext } from '@infor-up/m3-odin';
import { InvoiceStore } from './invoice.store';
import { FailuresStore } from './failures.store';
import { JobsStore } from './jobs.store';

@Injectable({
   providedIn: 'root'
})
export class AppStoreService {
   private readonly stateSubject = new BehaviorSubject<AppState>(initialAppState);
   readonly state$ = this.stateSubject.asObservable();

   readonly file$ = this.select(state => state.file);
   readonly userContext$ = this.select(state => state.userContext);
   readonly isBusy$ = this.select(state => state.isBusy);
   readonly selectedDate$ = this.select(state => state.selectedDate);
   readonly conoFromXml$ = this.select(state => state.conoFromXml);
   private readonly selectedDateSubject = new Subject<string | null>();
   readonly selectedDateChange$ = this.selectedDateSubject.asObservable();

   constructor(
      private invoiceStore: InvoiceStore,
      private failuresStore: FailuresStore,
      private jobsStore: JobsStore
   ) { }

   private select<T>(project: (state: AppState) => T): Observable<T> {
      return this.state$.pipe(map(project), distinctUntilChanged());
   }

   private updateState(patch: Partial<AppState>): void {
      this.stateSubject.next({
         ...this.stateSubject.value,
         ...patch
      });
   }

   setUserContext(userContext: IUserContext): void {
      this.updateState({ userContext });
   }

   setSelectedDate(date: string | null): void {
      this.updateState({ selectedDate: date });
      this.selectedDateSubject.next(date);
   }

   /**
 * Synchronously return the current selected date from the store (YYYYMMDD or null)
 */
   getSelectedDate(): string | null {
      return this.stateSubject.value.selectedDate;
   }

   getUserContextSync(): IUserContext | null {
      return this.stateSubject.value.userContext;
   }

   setConoFromXml(cono: string | null): void {
      this.updateState({ conoFromXml: cono });
   }

   setBusy(isBusy: boolean): void {
      this.updateState({ isBusy });
   }

   setInvoices(invoices: Invoice[]): void {
      this.invoiceStore.setInvoices(invoices);
      this.updateState({ invoices });
   }

   setStats(stats: Stat[]): void {
      this.updateState({ stats });
   }

   setFailures(failures: Failure[]): void {
      this.failuresStore.setFailures(failures);
      this.updateState({ failures });
   }

   setJobs(jobs: any[]): void {
      this.jobsStore.setJobs(jobs);
      this.updateState({ jobs });
   }

   setFiles(file: any[]): void {
      this.updateState({ file });
   }

   selectInvoice(id: number): void {
      this.invoiceStore.selectInvoice(id);
      this.updateState({ selectedInvoiceId: id });
   }

   updateInvoiceStatus(id: number, status: string): void {
      this.invoiceStore.updateInvoiceStatus(id, status);
      const invoices = this.stateSubject.value.invoices.map(invoice =>
         invoice.id === id ? { ...invoice, status } : invoice
      );
      this.setInvoices(invoices);
   }

   /**
    * Load job data from CMS100MI/LstJob API
    * @returns Observable to track loading state
    */
   loadJobsData(date: string): Observable<any[]> {
      this.setBusy(true);
      return this.jobsStore.loadJobsData(date).pipe(
         map(jobs => {
            this.setJobs(jobs);
            return jobs;
         }),
         finalize(() => this.setBusy(false))
      );
   }
}
