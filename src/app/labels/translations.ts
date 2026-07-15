export const Translations = {
   gb: {
      messages: {
         REPL: { id: 'REPL', value: 'Invoice Number' },
         INST: { id: 'INST', value: 'Status' },
         PK01: { id: 'PK01', value: 'Job No' },
         Status: { id: 'Status', value: 'Status' },
         PK02: { id: 'PK02', value: 'Invoice No' },
         IVNO: { id: 'IVNO', value: 'Invoice Number' },
         UUID: { id: 'UUID', value: 'BOD UUID' },
         STAT: { id: 'STAT', value: 'MNS270 Status' },
         PRTF: { id: 'PRTF', value: 'Print File' },
         FINA: { id: 'FINA', value: 'IDM File' },
         EMSG: { id: 'EMSG', value: 'Output Status' },
         Invoice_Generated: {
            id: 'Invoice Generated',
            value: 'Invoice Generated',
         },
      },
   },
   fr: {
      messages: {
         REPL: { id: 'REPL', value: 'Numéro de facture' },
         INST: { id: 'INST', value: 'Statut' },
         PK01: { id: 'PK01', value: 'Numéro de travail' },
         Status: { id: 'Status', value: 'Statut' },
         PK02: { id: 'PK02', value: 'Numéro de facture' },
         IVNO: { id: 'IVNO', value: 'Numéro de facture' },
         UUID: { id: 'UUID', value: 'BOD UUID' },
         STAT: { id: 'STAT', value: 'Statut' },
         PRTF: { id: 'PRTF', value: 'Fichier d\'impression' },
         FINA: { id: 'FINA', value: 'Fichier IDM' },
         EMSG: { id: 'EMSG', value: 'Statut de sortie' },
         Invoice_Generated: { id: 'Invoice Generated', value: 'Facture générée' },
      },
   },
} as ITranslations;

interface ITranslations {
   [key: string]: any;
}
