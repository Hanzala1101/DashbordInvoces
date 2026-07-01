import { Component } from '@angular/core';

@Component({
   selector: 'app-monitoring',
   templateUrl: './monitoring.component.html',
   styleUrl: './monitoring.component.css'
})
export class MonitoringComponent {
   activeMenuId: string | null = null;

   dummyInvoices = [
      { id: 1, number: 'INV-001', status: 'Paid' },
      { id: 2, number: 'INV-002', status: 'Pending' },
      { id: 3, number: 'INV-003', status: 'Overdue' },
      { id: 4, number: 'INV-004', status: 'Paid' },
      { id: 5, number: 'INV-005', status: 'Draft' }
   ];

   dummyStats = [
      { id: 1, metric: 'Total Invoices', value: '2,450', trend: '+12%' },
      { id: 2, metric: 'Processed', value: '2,180', trend: '+8%' },
      { id: 3, metric: 'Failed', value: '45', trend: '-5%' },
      { id: 4, metric: 'Pending', value: '225', trend: '+3%' },
      { id: 5, metric: 'Revenue', value: '$125K', trend: '+15%' }
   ];

   dummyFailures = [
      { id: 1, metric: 'Total Invoices' },
      { id: 2, metric: 'Processed' },
      { id: 3, metric: 'Failed' },
      { id: 4, metric: 'Pending' },
      { id: 5, metric: 'Revenue' }
   ];

   toggleMenu(menuId: string): void {
      this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
   }

   handleAction(action: string): void {
      console.log('Action selected:', action);
      this.activeMenuId = null;
   }
}
