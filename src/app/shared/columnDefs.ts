export class ColumnDefs {
  invoiceGeneratedColumns: SohoDataGridColumn[] = [
    {
      id: 'REPL',
      field: 'REPL',
      name: Soho.Locale.translate('REPL'),
      width: 150,
    },
  ];

  mnS270Columns: SohoDataGridColumn[] = [
    {
      id: 'PK01',
      field: 'PK01',
      name: Soho.Locale.translate('PK01'),
      width: 150,
    },
    {
      id: 'PK02',
      field: 'PK02',
      name: Soho.Locale.translate('PK02'),
      width: 150,
    },
  ];

  mecFailureColumns: SohoDataGridColumn[] = [
    {
      id: 'failure',
      field: 'failure',
      name: Soho.Locale.translate('Failure'),
    },
  ];
}
