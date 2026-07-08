import { Component, OnInit } from '@angular/core';
import { CoreBase, IUserContext } from '@infor-up/m3-odin';
import { MIService, UserService } from '@infor-up/m3-odin-angular';
import { AppStoreService } from './store/app-store.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from './services/data.service';
import { InvoiceStore } from './store/invoice.store';
import { JobsStore } from './store/jobs.store';
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent extends CoreBase implements OnInit {
   userContext = {} as IUserContext;
   isBusy = false;
   company!: string;
   currentCompany!: string;
   division!: string;
   currentDivision!: string;
   language!: string;
   currentLanguage!: string;
   // input-bound date in yyyy-MM-dd for <input type="date">
   selectedDateInput!: string;

   constructor(
      private miService: MIService,
      private userService: UserService,
      private store: AppStoreService,
      private http: HttpClient,
      private invoiceStore: InvoiceStore,
      private jobStore: JobsStore,
   ) {
      super('AppComponent');
   }

   ngOnInit() {
      this.onClickLoad();
      // this.store.loadConoFromXml('assets/292294047882523190OIS199PF_0.xml').subscribe(
      //    (cono) => {
      //       this.logInfo('Loaded CONO from XML: ' + cono);
      //    },
      //    (error) => {
      //       this.logError('Failed to load CONO from XML: ' + error.message);
      //    }
      // );
      // this.http.get('/assets/292294047882523190OIS199PF_0.xml', { responseType: 'text' }).subscribe(
      //    (xmlContent) => {
      //       const parser = new DOMParser();
      //       const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
      //       const queryNode = xmlDoc.querySelector('M3OutDocument > DataArea > Document > DocumentHeader > UIEXIN');
      //       if (queryNode) {
      //          console.log(queryNode.textContent, "CONO from XML")
      //       }

      //    })

   }

   onClickLoad(): void {
      this.logInfo('onClickLoad');
      this.store.setBusy(true);
      this.userService.getUserContext().subscribe((userContext: IUserContext) => {
         this.logInfo('onClickLoad: Received user context');
         this.store.setUserContext(userContext);
         this.userContext = userContext;
         this.updateUserValues(userContext);
         const CONO = userContext.company?.toString() || this.company;
         const data = new Date().toISOString().split('T')[0];
         // input value is yyyy-MM-dd, stored date is yyyyMMdd
         this.selectedDateInput = data;
         const storeDate = data.replace(/-/g, '');
         this.store.setSelectedDate(storeDate);
         // Load invoice data from EXPORTMI API (pass YYYYMMDD)
         this.invoiceStore.loadInvoiceData(CONO, storeDate)
      }, (error) => {
         this.store.setBusy(false);
         this.logError('Unable to get userContext ' + error);
      });
   }

   onDateChange(dateStr: string): void {
      this.selectedDateInput = dateStr;
      const storeDate = (dateStr || '').replace(/-/g, '');
      this.store.setSelectedDate(storeDate);

      const CONO = this.userContext?.company || this.company;
      console.log('Date changed to:', dateStr, 'Store date:', storeDate, 'CONO:', CONO);
      if (CONO) {
         this.invoiceStore.loadInvoiceData(CONO.trim(), storeDate)
      }
      this.jobStore.loadJobsData(storeDate);
   }

   updateUserValues(userContext: IUserContext) {
      this.company = userContext.company || '';
      this.division = userContext.division || '';
      this.language = userContext.language || '';

      this.currentCompany = userContext.currentCompany || '';
      this.currentDivision = userContext.currentDivision || '';
      this.currentLanguage = userContext.currentLanguage || '';
   }

   private setBusy(isBusy: boolean) {
      this.isBusy = isBusy;
   }
}
