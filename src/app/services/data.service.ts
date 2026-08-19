import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { IonApiService, MIService, ApplicationService } from '@infor-up/m3-odin-angular';
import { GlobalStore } from '../store/global-store';

@Injectable({
   providedIn: 'root',
})
export class DataService {
   private url: string = '';
   constructor(private miService: MIService, private ionaAPIService: IonApiService, private applicationservice: ApplicationService) {
      this.miService = miService;
      this.ionaAPIService = ionaAPIService;
      this.applicationservice = applicationservice;
   }
   api = "https://mingle-ionapi.eu1.inforcloudsuite.com/HPZNVKVUB7E74B6F_DEV/GENAI/chatsvc";
   /**
    * Call EXPORTMI API to fetch invoice data
    * @returns Observable with invoice, stats, and failure data
    */
   fetchInvoiceData(CONO: string = '780', date: string): Observable<any> {
      // Date expected as yyyy-MM-dd from datepicker; convert to YYYYMMDD for query
      const qDate = (date || '').replace(/-/g, '');
      const conoVal = CONO || '';
      const qery = `UHIVNO, UHINST from OINVOH where UHCONO = ${conoVal} and UHIDAT = ${qDate}`;

      return this.miService.execute({
         program: 'EXPORTMI',
         transaction: 'Select',
         record: {
            SEPC: ",",
            QERY: qery,
         },
      });
   }
   fetchInvoiceData2(CONO: string = '780', date: string): Observable<any> {
      // Date expected as yyyy-MM-dd from datepicker; convert to YYYYMMDD for query
      const qDate = (date || '').replace(/-/g, '');
      const conoVal = CONO || '';
      const qery = `IHIVNO, IHAIIS from ACUIVH where IHCONO = ${conoVal} and IHIVDT = ${qDate}`;

      return this.miService.execute({
         program: 'EXPORTMI',
         transaction: 'Select',
         record: {
            SEPC: ",",
            QERY: qery,
         },
      });
   }

   /**
    * Fetch job data from CMS100MI/LstJob
    * @returns Observable with Job array
    */
   fetchJobs(jobNo: string | null): Observable<any> {
      return this.callMIAPI('CMS100MI', 'LstJobs', {
         C4BJNO: jobNo,
         C4PRTF: 'OIS199PF',
      });
   }
   /**
    * Fetch job data from CMS100MI/LstJob
    * @returns Observable with Job array
    */
   fetchFiles(jobNo: string | null, printFile: string | null): Observable<any> {
      return this.callMIAPI('CMS100MI', 'LstFiles', {
         CXBJNO: jobNo,
         CXPRTF: printFile,
      });
   }
   /**
    * Fetch MNS270 data from CUSEXTMI/LstFieldValue
    * @returns Observable with MNS270 array
    */
   fetchMNS270(date: string, printFile: string | null): Observable<any[]> {
      const qDate = (date || '').replace(/-/g, '');
      return this.callMIAPI('EXT780MI', 'List', {
         PRTF: printFile,
         GEN1: qDate,
         EMSG: "OINVIP",
      });
   }

   /**
    * Fetch IDM XML for a job number. Returns the raw XML string (or empty string on missing data).
    */
   fetchIdmXml(invoNo: string, printFile: string): Observable<any> {
      if (!invoNo) {
         return from(['']);
      }
      if(printFile == "OIS199PF") {
         this.url = `/IDM/api/items/search/item?%24query=%2FM3_SalesInvoice%5B%40M3_InvoiceNumber%20%3D%20%22${invoNo}%22%5D%20`
      }else if(printFile == "COS184PF") {
         this.url = `/IDM/api/items/search/item?%24query=%2FM3_MCO_Invoice%5B%40M3_Invoice_Number%20%3D%20%22${invoNo}%22%5D%20`
      }
      const request = {
         // /M3_MCO_Invoice[@M3_Invoice_Number = "26000434"]
         url: this.url,
         method: 'GET',
         // record: {
         //    query: `/M3_SalesInvoice[@M3_InvoiceNumber = "26000065"]`,
         // },
         source: 'DEV',
      };

      const response = this.ionaAPIService.execute(request)
      return response.pipe(
         map((res: any) => {
            return res
         }),
         catchError((error) => {
            console.error('Error fetching IDM XML:', error);
            return throwError(() => new Error(`IDM API Error: ${error.message}`));
         }),
      );
   }


   /**
    * Fetch job data from CMS100MI/LstJob
    * @returns Observable with Job array
    */
   listFIles(JBNO: String): Observable<File[]> {
      return this.callMIAPI('CMS100MI', 'LstFiles', {
         CXBJNO: JBNO,
         CXPRTF: 'OIS199PF',
      });
   }
   /**
    * Fetch job data from CMS100MI/LstJob
    * @returns Observable with Job array
    */
   listMecError(date: String): Observable<File[]> {
      const qDate = (date || '').replace(/-/g, '');
      return this.callMIAPI('EXT780MI', 'List', {
         PRTF: "OIS199PF",
         GEN1: qDate,
      });
   }

   getSession(): void {
      const request = {
         url: `/GENAI/chatsvc/api/v1/sessions`,
         method: 'POST',
         body: {
            name: `Hanzala`,
         },
         source: 'DEV',
      };
      this.ionaAPIService.execute(request).subscribe((res: any) => {
         console.log(res, "resonse if session", res.body)
         localStorage.setItem("chatsrv", res.body.id)
      })
   }

   askGenAI(text: string): Observable<any> {
      const payload = {
         prompt: text,
         session: localStorage.getItem('chatsrv') || '',
         tools: ['HEALTH_InvoiceMonitorMNS270_Agent'],
         ibcPayload: {
            additionalProp1: {}
         },
         focusMode: 'invoice',
         streamMode: 'complete'
      };
      const request = {
         url: `/GENAI/chatsvc/api/v1/chat/sync`,
         method: 'POST',
         body: payload,
         source: 'DEV',
      };

      return this.ionaAPIService.execute(request)
   }
   /**
    * Generic method to call any M3 API using MIService
    * @param program M3 application name
    * @param transaction Transaction name
    * @param record Record parameters
    */
   callMIAPI(
      program: string,
      transaction: string,
      record: any,
   ): Observable<any> {
      return this.miService
         .execute({
            program,
            transaction,
            record,
         })
         .pipe(
            catchError((error) => {
               console.error(`Error calling ${program}/${transaction}:`, error);
               return throwError(() => new Error(`MI API Error: ${error.message}`));
            }),
         );
   }



}
