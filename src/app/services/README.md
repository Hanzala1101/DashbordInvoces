# Data Service & Store Setup

## Overview
This folder contains the RxJS-based state management for the Invoice Monitoring application, with integration to the M3 EXPORTMI API.

## Structure

### Services Folder
- **data.service.ts** - Handles all API calls to M3 using MIService
  - `fetchInvoiceData()` - Calls EXPORTMI to retrieve invoices, stats, and failures
  - `callMIAPI()` - Generic method to call any M3 API

### Store Folder
- **app-store.state.ts** - Defines the application state interface and initial state
- **app-store.service.ts** - Central RxJS BehaviorSubject-based store

## Usage

### 1. Subscribe to Store Observables
In any component, inject `AppStoreService` and subscribe to observables:

```typescript
import { AppStoreService } from '../store/app-store.service';

export class MyComponent {
  constructor(private store: AppStoreService) {}

  ngOnInit() {
    this.store.invoices$.subscribe(invoices => {
      console.log('Invoices:', invoices);
    });
  }
}
```

### 2. Fetch Data from EXPORTMI
Call the `loadInvoiceData()` method which automatically updates the store:

```typescript
this.store.loadInvoiceData().subscribe(
  data => console.log('Data loaded'),
  error => console.error('Error:', error)
);
```

### 3. Update Store State
Use store methods to update state:

```typescript
// Update invoices
this.store.setInvoices(newInvoices);

// Update stats
this.store.setStats(newStats);

// Select an invoice
this.store.selectInvoice(invoiceId);

// Update busy state
this.store.setBusy(true);
```

### 4. Call Custom M3 APIs
Use the generic `callMIAPI()` method in DataService:

```typescript
this.dataService.callMIAPI('SOMEPGM', 'TRANSACTION', {
  field1: 'value1',
  field2: 'value2'
}).subscribe(response => {
  // Handle response
});
```

## EXPORTMI API Response Format

The DataService expects the M3 response to have this structure:

```json
{
  "results": [
    {
      "recordType": "invoice",
      "id": "1",
      "number": "INV-001",
      "status": "Paid"
    },
    {
      "recordType": "stat",
      "id": "1",
      "metric": "Total Invoices",
      "value": "2,450",
      "trend": "+12%"
    },
    {
      "recordType": "failure",
      "id": "1",
      "metric": "Total Invoices"
    }
  ]
}
```

## State Interface

```typescript
interface AppState {
  userContext: IUserContext | null;
  isBusy: boolean;
  invoices: Invoice[];
  stats: Stat[];
  failures: Failure[];
  selectedInvoiceId: number | null;
}
```

## Observables Available

- `invoices$` - Stream of invoice data
- `stats$` - Stream of statistics data
- `failures$` - Stream of failure data
- `selectedInvoiceId$` - Currently selected invoice ID
- `userContext$` - User context from M3
- `isBusy$` - Loading state
- `state$` - Complete app state

All observables use `distinctUntilChanged()` to prevent redundant emissions.

## Error Handling

Errors are logged to the console and propagated through the Observable stream. Components should subscribe with error handlers:

```typescript
this.store.loadInvoiceData().subscribe(
  data => { /* success */ },
  error => { /* handle error */ }
);
```
