export interface MNS270Fileds {
   IVNO: string;
   UUID: string;
   C4SSTA: string;
   FINA?: string;
   LINK: string;
}

export interface InvoiceGeneratedFileds {
   REPL: string;
   INST: string;
   PRTF?: string;
}

export interface MECFailureFileds {
   IVNO: string;
   UUID: string;
}

export interface GenAiFileds {
   userText: string;
   bodText: string;
}
