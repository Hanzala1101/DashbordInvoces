export class ColumnDefs {
   invoiceGeneratedColumns: SohoDataGridColumn[] = [
      {
         id: 'REPL',
         field: 'REPL',
         name: Soho.Locale.translate('REPL'),
         width: 150,
      },
      {
         id: 'INST',
         field: 'INST',
         name: Soho.Locale.translate('INST'),
         width: 100,
      },
      {
         id: 'PRTF',
         field: 'PRTF',
         name: Soho.Locale.translate('PRTF'),
         width: 150,
      },
   ];

   mnS270Columns: SohoDataGridColumn[] = [
      {
         id: 'IVNO',
         field: 'IVNO',
         name: Soho.Locale.translate('PK02'),
         width: 120,
      },
      {
         id: 'UUID',
         field: 'UUID',
         name: Soho.Locale.translate('PK01'),
         width: 160,
      },
      {
         id: 'C4SSTA',
         field: 'C4SSTA',
         name: Soho.Locale.translate('STAT'),
         width: 100,
      },
      {
         id: 'FINA',
         field: 'FINA',
         name: Soho.Locale.translate('FINA'),
         width: 150,
         formatter: 'Hyperlink',
         href: (row: any, cell: any, col: any, value: any,) => col?.LINK || "",
         target: '_blank',
      },
   ];

   mecFailureColumns: SohoDataGridColumn[] = [
      {
         id: 'IVNO',
         field: 'IVNO',
         name: Soho.Locale.translate('IVNO'),
         width: 150,
      },
      {
         id: 'UUID',
         field: 'UUID',
         name: Soho.Locale.translate('UUID'),
         width: 150,
      },
      {
         id: 'EMSG',
         field: 'EMSG',
         name: Soho.Locale.translate('EMSG'),
         width: 150,
      },
   ];
}
