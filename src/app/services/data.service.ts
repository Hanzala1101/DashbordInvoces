import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { IonApiService, MIService } from '@infor-up/m3-odin-angular';

@Injectable({
   providedIn: 'root',
})
export class DataService {
   constructor(private miService: MIService, private ionaAPIService: IonApiService) {
      this.miService = miService;
      this.ionaAPIService = ionaAPIService;
   }

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
   fetchJobs(jobNo: string | null): Observable<any[]> {
      return this.callMIAPI('CMS100MI', 'LstJobs', {
         C4BJNO: jobNo,
         C4PRTF: 'OIS199PF',
      });
   }
   /**
    * Fetch MNS270 data from CUSEXTMI/LstFieldValue
    * @returns Observable with MNS270 array
    */
   fetchMNS270(date: string): Observable<any[]> {
      // return this.callMIAPI('CUSEXTMI', 'LstFieldValue', {
      //    FILE: 'HACKATHON',
      //    PK01: jobNo,
      // });
      const qDate = (date || '').replace(/-/g, '');
      return this.callMIAPI('EXT780MI', 'List', {
         PRTF: "OIS199PF",
         GEN1: qDate,
         EMSG: "OINVIP",
      });
   }

   /**
    * Fetch IDM XML for a job number. Returns the raw XML string (or empty string on missing data).
    */
   fetchIdmXml(invoNo: string): Observable<any> {
      if (!invoNo) {
         return from(['']);
      }
      const request = {
         url: `/IDM/api/items/search/item?query=/M3_SalesInvoice[@M3_InvoiceNumber = "026000065"] `,
         method: 'GET',
         // record: {
         //    query: `/M3_SalesInvoice[@M3_InvoiceNumber = "26000065"]`,
         // },
         source: 'https://mingle-ionapi.eu1.inforcloudsuite.com/HPZNVKVUB7E74B6F_DEV',
      };
      return this.ionaAPIService.execute(request)
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
