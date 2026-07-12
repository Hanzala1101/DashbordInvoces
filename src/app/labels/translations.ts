export const Translations = {
  gb: {
    messages: {
      REPL: { id: 'REPL', value: 'Invoice Number' },
      PK01: { id: 'PK01', value: 'Job No' },
      Status: { id: 'Status', value: 'Status' },
      PK02: { id: 'PK02', value: 'Invoice No' },
      Failure: { id: 'Failure', value: 'Failure' },
      Invoice_Generated: {
        id: 'Invoice Generated',
        value: 'Invoice Generated',
      },
    },
  },
  fr: {
    messages: {
      REPL: { id: 'REPL', value: 'Numéro de facture' },
      PK01: { id: 'PK01', value: 'Numéro de travail' },
      Status: { id: 'Status', value: 'Statut' },
      PK02: { id: 'PK02', value: 'Numéro de facture' },
      Failure: { id: 'Failure', value: 'Échec' },
      Invoice_Generated: { id: 'Invoice Generated', value: 'Facture générée' },
    },
  },
} as ITranslations;

interface ITranslations {
  [key: string]: any;
}
