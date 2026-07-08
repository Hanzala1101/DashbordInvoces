import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { MIService } from '@infor-up/m3-odin-angular';
import { Invoice, Stat, Failure, Job, File } from '../store/app-store.state';


@Injectable({
   providedIn: 'root'
})
export class DataService {

   constructor(private miService: MIService) { }

   /**
    * Call EXPORTMI API to fetch invoice data
    * @returns Observable with invoice, stats, and failure data
    */
   fetchInvoiceData(CONO: string, date: string): Observable<any> {
      // Date expected as yyyy-MM-dd from datepicker; convert to YYYYMMDD for query
      const qDate = (date || '').replace(/-/g, '');
      const conoVal = CONO || '';
      const qery = `UHIVNO from OINVOH where UHCONO = ${conoVal} and UHIDAT = ${qDate}`;

      return this.miService.execute({
         program: 'EXPORTMI',
         transaction: 'Select',
         record: {
            QERY: qery
         }

      }).pipe(
         tap(data => console.log('Fetched invoice data:', data)),
         catchError(error => {
            console.error('Error fetching invoice data from EXPORTMI:', error);
            return throwError(() => new Error(`Failed to fetch data: ${error.message}`));
         })
      );
   }


   /**
            * Fetch an XML file from a URL and extract the ZZCONO value
            */
   fetchConoFromXml(url: string): Observable<string> {
      return from(fetch(url)).pipe(
         switchMap((res: Response) => {
            if (!res.ok) {
               return throwError(() => new Error(`Failed to fetch XML: ${res.status}`));
            }
            return res.text();
         }),
         map((responseText: string) => {
            try {
               const parser = new DOMParser();
               // First parse as HTML, since the response may be rendered HTML rather than raw XML
               const htmlDoc = parser.parseFromString(responseText, 'text/html');
               let node = htmlDoc.querySelector('M3OutDocument > DataArea > Document > DocumentHeader > UIEXIN')
                  || htmlDoc.querySelector('UIEXIN');

               if (!node) {
                  const xmlDoc = parser.parseFromString(responseText, 'application/xml');
                  node = xmlDoc.querySelector('M3OutDocument > DataArea > Document > DocumentHeader > UIEXIN')
                     || xmlDoc.querySelector('UIEXIN');
               }

               let value = node?.textContent?.trim() || '';
               if (!value) {
                  const match = responseText.match(/<UIEXIN[^>]*>([^<]+)<\/UIEXIN>/i);
                  value = match?.[1]?.trim() || '';
               }
               return value;
            } catch (err) {
               return '';
            }
         }),
         tap((val: string) => console.log('Extracted ZZCONO from XML/HTML:', val)),
         catchError(error => {
            console.error('Error fetching/parsing XML/HTML:', error);
            return throwError(() => new Error(error.message || 'XML/HTML fetch/parse error'));
         })
      );
   }

   /**
    * Fetch job data from CMS100MI/LstJob
    * @returns Observable with Job array
    */
   fetchJobsData(date: string | null): Observable<Job[]> {
      return this.callMIAPI('CMS100MI', 'LstJob', {
         C4PRTF: "OIS199PF",
         C4RGDT: date ? date : '20260707'
      }).pipe(
         map((response: any) => {
            const jobs: Job[] = [];
            if (response && response.items && Array.isArray(response.items)) {
               response.items.forEach((record: any, index: number) => {
                  jobs.push({
                     id: index + 1,
                     jobNo: record.C4BJNO || '',
                     status: record.C4SSTA || 'Unknown',
                     invoiceNo: record.C4INNO || ''
                  });
               });
            }
            return jobs;
         }),

         tap(data => console.log('Fetched jobs data:', data)),
         catchError(error => {
            console.error('Error fetching jobs data from CMS100MI:', error);
            return throwError(() => new Error(`Failed to fetch jobs: ${error.message}`));
         })
      );
   }


   /**
    * Fetch job data from CMS100MI/LstJob
    * @returns Observable with Job array
    */
   listFIles(JBNO: String): Observable<File[]> {
      return this.callMIAPI('CMS100MI', 'LstFiles', {
         CXBJNO: JBNO,
         CXPRTF: "OIS199PF"
      }).pipe(
         map((response: any) => {
            const file: File[] = [];
            if (response && response.items && Array.isArray(response.items)) {
               response.items.forEach((record: any, index: number) => {
                  file.push({
                     id: index + 1,
                     jobNo: record.CXBJNO || '',
                     filename: record.CXFNAM || 'Unknown'
                  });
               });
            }
            return file;
         }),
         tap(data => console.log('Fetched jobs data:', data)),
         catchError(error => {
            console.error('Error fetching jobs data from CMS100MI:', error);
            return throwError(() => new Error(`Failed to fetch jobs: ${error.message}`));
         })
      );
   }

   /**
    * Generic method to call any M3 API using MIService
    * @param program M3 application name
    * @param transaction Transaction name
    * @param record Record parameters
    */
   callMIAPI(program: string, transaction: string, record: any): Observable<any> {
      return this.miService.execute({
         program,
         transaction,
         record
      }).pipe(
         catchError(error => {
            console.error(`Error calling ${program}/${transaction}:`, error);
            return throwError(() => new Error(`MI API Error: ${error.message}`));
         })
      );
   }
}
