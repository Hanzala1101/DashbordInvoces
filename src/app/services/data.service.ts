import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { MIService } from '@infor-up/m3-odin-angular';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private miService: MIService) {}

  /**
   * Call EXPORTMI API to fetch invoice data
   * @returns Observable with invoice, stats, and failure data
   */
  fetchInvoiceData(CONO: string = '780', date: string): Observable<any> {
    // Date expected as yyyy-MM-dd from datepicker; convert to YYYYMMDD for query
    const qDate = (date || '').replace(/-/g, '');
    const conoVal = CONO || '';
    const qery = `UHIVNO from OINVOH where UHCONO = ${conoVal} and UHIDAT = ${qDate}`;

    return this.miService.execute({
      program: 'EXPORTMI',
      transaction: 'Select',
      record: {
        QERY: qery,
      },
    });
  }

  /**
   * Fetch job data from CMS100MI/LstJob
   * @returns Observable with Job array
   */
  fetchJobs(date: string | null): Observable<any[]> {
    const qDate = (date || '').replace(/-/g, '');
    return this.callMIAPI('CMS100MI', 'LstJob', {
      C4PRTF: 'OIS199PF',
      C4RGDT: qDate ? qDate : '20260707',
    });
  }
  /**
   * Fetch MNS270 data from CUSEXTMI/LstFieldValue
   * @returns Observable with MNS270 array
   */
  fetchMNS270(jobNo: string): Observable<any[]> {
    return this.callMIAPI('CUSEXTMI', 'LstFieldValue', {
      FILE: 'HACKATHON',
      PK01: jobNo,
    });
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
