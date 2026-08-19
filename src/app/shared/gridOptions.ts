import { ColumnDefs } from './columnDefs';

export class gridOptions {
   mnS270GridOptions: SohoDataGridOptions;
   invoiceGeneratedGridOptions: SohoDataGridOptions;
   mecFailureGridOptions: SohoDataGridOptions;

   constructor() {
      const columnDefs = new ColumnDefs();

      this.mnS270GridOptions = {
         columns: columnDefs.mnS270Columns,
         selectable: 'mixed',
         filterable: true,
         disableRowDeactivation: true,
         rowHeight: 'small',
         disableClientFilter: true,
         filterWhenTyping: false,
         spacerColumn: true,
         enableTooltips: true
      };

      this.invoiceGeneratedGridOptions = {
         columns: columnDefs.invoiceGeneratedColumns,
         selectable: 'mixed',
         filterable: true,
         disableRowDeactivation: true,
         rowHeight: 'small',
         disableClientFilter: true,
         filterWhenTyping: false,
         spacerColumn: true,
         enableTooltips: true
      };

      this.mecFailureGridOptions = {
         columns: columnDefs.mecFailureColumns,
         selectable: 'mixed',
         filterable: true,
         disableRowDeactivation: true,
         rowHeight: 'small',
         disableClientFilter: true,
         filterWhenTyping: false,
         spacerColumn: true,
         enableTooltips: true
      };
   }
}
