import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, finalize, tap } from 'rxjs/operators';
import { AppState, initialAppState, Failure, Invoice, Stat } from './app-store.state';
import type { IUserContext } from '@infor-up/m3-odin';
import { DataService } from '../services/data.service';

@Injectable({
   providedIn: 'root'
})
export class AppStoreService {
   private readonly stateSubject = new BehaviorSubject<AppState>(initialAppState);
   readonly state$ = this.stateSubject.asObservable();

   readonly invoices$ = this.select(state => state.invoices);
   readonly stats$ = this.select(state => state.stats);
   readonly failures$ = this.select(state => state.failures);
   readonly jobs$ = this.select(state => state.jobs);
   readonly file$ = this.select(state => state.file);
   readonly selectedInvoiceId$ = this.select(state => state.selectedInvoiceId);
   readonly userContext$ = this.select(state => state.userContext);
   readonly isBusy$ = this.select(state => state.isBusy);
   readonly selectedDate$ = this.select(state => state.selectedDate);
   readonly conoFromXml$ = this.select(state => state.conoFromXml);

   constructor(private dataService: DataService) { }

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
   }

   setConoFromXml(cono: string | null): void {
      this.updateState({ conoFromXml: cono });
   }

   // loadConoFromXml(url: string) {
   //    return this.dataService.fetchConoFromXml(url).pipe(
   //       tap(cono => this.setConoFromXml(cono))
   //    );
   // }

   setBusy(isBusy: boolean): void {
      this.updateState({ isBusy });
   }

   setInvoices(invoices: Invoice[]): void {
      this.updateState({ invoices });
   }

   setStats(stats: Stat[]): void {
      this.updateState({ stats });
   }

   setFailures(failures: Failure[]): void {
      this.updateState({ failures });
   }

   setJobs(jobs: any[]): void {
      this.updateState({ jobs });
   }

   setFiles(file: any[]): void {
      this.updateState({ file });
   }

   selectInvoice(id: number): void {
      this.updateState({ selectedInvoiceId: id });
   }

   updateInvoiceStatus(id: number, status: string): void {
      const invoices = this.stateSubject.value.invoices.map(invoice =>
         invoice.id === id ? { ...invoice, status } : invoice
      );
      this.setInvoices(invoices);
   }

   /**
    * Load invoice data from EXPORTMI API
    * @returns Observable to track loading state
    */
   loadInvoiceData(CONO: string, date: string): Observable<any> {
      this.setBusy(true);
      return this.dataService.fetchInvoiceData(CONO, date).pipe(
         map(data => {
            if (data.invoices) this.setInvoices(data.invoices);
            if (data.stats) this.setStats(data.stats);
            if (data.failures) this.setFailures(data.failures);
            return data;
         }),
         finalize(() => this.setBusy(false))
      );
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
