export class ColumnDefs {
   invoiceGeneratedColumns: SohoDataGridColumn[] = [
      {
         id: 'REPL',
         field: 'REPL',
         name: Soho.Locale.translate('REPL'),
      },
      {
         id: 'INST',
         field: 'INST',
         name: Soho.Locale.translate('INST'),
      },
      {
         id: 'PRTF',
         field: 'PRTF',
         name: Soho.Locale.translate('PRTF'),
      },
   ];

   mnS270Columns: SohoDataGridColumn[] = [
      {
         id: 'IVNO',
         field: 'IVNO',
         name: Soho.Locale.translate('PK02'),
      },
      {
         id: 'UUID',
         field: 'UUID',
         name: Soho.Locale.translate('PK01'),
      },
      {
         id: 'C4SSTA',
         field: 'C4SSTA',
         name: Soho.Locale.translate('STAT'),
      },
      {
         id: 'FINA',
         field: 'FINA',
         name: Soho.Locale.translate('FINA'),
         formatter: 'Hyperlink',
         href: (row: any, cell: any, col: any, value: any,) => col?.LINK || "",
         tooltip: (row: any, cell: any, col: any, value: any) => value || col?.FINA || "",
         target: '_blank',
      },
   ];

   mecFailureColumns: SohoDataGridColumn[] = [
      {
         id: 'IVNO',
         field: 'IVNO',
         name: Soho.Locale.translate('IVNO'),
      },
      {
         id: 'UUID',
         field: 'UUID',
         name: Soho.Locale.translate('UUID'),
      },
      {
         id: 'EMSG',
         field: 'EMSG',
         name: Soho.Locale.translate('EMSG'),
         tooltip: (row: any, cell: any, col: any, value: any) => value || col?.EMSG || "",
      },
   ];
}
