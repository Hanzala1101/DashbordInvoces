import { IUserContext } from '@infor-up/m3-odin';

export interface Invoice {
   id: number;
   number: string;
   status: string;
}

export interface Stat {
   id: number;
   jobNumber: string;
   status: string;
   invoiceNumber: string;
}

export interface Failure {
   id: number;
   metric: string;
}

export interface Job {
   id: number;
   jobNo: string;
   status: string;
   invoiceNo: string;
}

export interface File {
   id: number;
   jobNo: string;
   filename: string;
}

export interface AppState {
   userContext: IUserContext | null;
   isBusy: boolean;
   invoices: Invoice[];
   stats: Stat[];
   failures: Failure[];
   jobs: Job[];
   file: File[];
   selectedInvoiceId: number | null;
   selectedDate: string | null;
   // CONO extracted from XML (stored as string, e.g. '780')
   conoFromXml: string | null;
   date: string | null;
}

export const initialAppState: AppState = {
   userContext: null,
   isBusy: false,
   selectedInvoiceId: null,
   // stored as YYYYMMDD
   selectedDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
   conoFromXml: null,
   invoices: [
      { id: 1, number: 'INV-001', status: 'Paid' },
      { id: 2, number: 'INV-002', status: 'Pending' },
      { id: 3, number: 'INV-003', status: 'Overdue' },
      { id: 4, number: 'INV-004', status: 'Paid' },
      { id: 5, number: 'INV-005', status: 'Draft' }
   ],
   stats: [
      { id: 1, jobNumber: 'Total Invoices', status: '2,450', invoiceNumber: '+12%' },
      { id: 2, jobNumber: 'Processed', status: '2,180', invoiceNumber: '+8%' },
      { id: 3, jobNumber: 'Failed', status: '45', invoiceNumber: '-5%' },
      { id: 4, jobNumber: 'Pending', status: '225', invoiceNumber: '+3%' },
      { id: 5, jobNumber: 'Revenue', status: '$125K', invoiceNumber: '+15%' }
   ],
   failures: [
      { id: 1, metric: 'Total Invoices' },
      { id: 2, metric: 'Processed' },
      { id: 3, metric: 'Failed' },
      { id: 4, metric: 'Pending' },
      { id: 5, metric: 'Revenue' }
   ],
   jobs: [],
   file: [],
   date: "",
};
