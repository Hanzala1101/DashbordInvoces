import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../store/app-store.state';
import { JobsStore } from '../store/jobs.store';

@Component({
   selector: 'app-mns270',
   templateUrl: './mns270.component.html',
   styleUrl: './mns270.component.css'
})
export class MNS270Component implements OnInit {
   activeMenuId: string | null = null;
   jobs$: Observable<Job[]>;

   constructor(private jobsStore: JobsStore) {
      this.jobs$ = this.jobsStore.jobs$;
   }

   ngOnInit(): void {
      // Load jobs data from CMS100MI/LstJob API
      this.jobsStore.loadJobsData().subscribe(
         () => console.log('Jobs data loaded successfully'),
         (error) => console.error('Failed to load jobs data:', error)
      );
   }

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Jobs status card action selected:', action);
      this.activeMenuId = null;
   }
}
