import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Job } from '../store/app-store.state';
import { JobsStore } from '../store/jobs.store';
import { AppStoreService } from '../store/app-store.service';
import { DataService } from '../services/data.service';

@Component({
   selector: 'app-mns270',
   templateUrl: './mns270.component.html',
   styleUrls: ['./mns270.component.css']
})
export class MNS270Component implements OnInit, OnDestroy {
   activeMenuId: string | null = null;
   jobs$: Observable<Job[]>;
   private subscriptions = new Subscription();

   constructor(private jobsStore: JobsStore, private appStore: AppStoreService, private dataService: DataService) {
      this.jobs$ = this.jobsStore.jobs$;
   }

   ngOnInit(): void {
      const date = this.appStore.getSelectedDate(); // initial load
      this.loadJobs(date);

      this.subscriptions.add(
         this.appStore.selectedDateChange$.subscribe((newDate) => {
            this.loadJobs(newDate);
         })
      );
   }

   private loadJobs(date: string | null): void {
      this.jobsStore.loadJobsData(date).subscribe(
         (jobs) => {
            console.log('Jobs data loaded successfully');
            this.loadJobInvoiceNumbers(jobs);
         },
         (error) => console.error('Failed to load jobs data:', error)
      );
   }

   private loadJobInvoiceNumbers(jobs: Job[]): void {
      const url = 'https://m3-cm3xprduse1b.m32.m3.us1.mprd.inforcloudsuite.com/foundation/mvxout?file=';

      jobs.forEach((job) => {
         this.dataService.listFIles(job.jobNo).subscribe(
            (files) => {
               files.forEach((file) => {
                  this.dataService.fetchConoFromXml(url + file.filename).subscribe(
                     (invo) => {
                        const updatedJobs = jobs.map((j) =>
                           j.jobNo === job.jobNo ? { ...j, invoiceNo: invo } : j
                        );
                        this.jobsStore.setJobs(updatedJobs);
                        console.log(`Job ${job.jobNo} has CONO: ${invo}`);
                     },
                     (error) => console.error('Error fetching CONO for file:', file.filename, error)
                  );
               });
            },
            (error) => console.error('Error fetching files for job:', job.jobNo, error)
         );
      });
   }

   ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
   }

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Jobs status card action selected:', action);
      this.activeMenuId = null;
   }
}
