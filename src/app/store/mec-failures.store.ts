import { Injectable } from '@angular/core';
import { MECFailureFileds } from '../shared/models';
import { Store } from './store';

class FailuresState {
  data: MECFailureFileds[] = [];
  isBusy: boolean = false;
}

@Injectable({
  providedIn: 'root',
})
export class FailuresStore extends Store<FailuresState> {
  constructor() {
    super(new FailuresState());
  }

  reset(): void {
    this.setState({ ...this.state, ...new FailuresState() });
  }

  clearRowSelection(): void {
    this.setState({ ...this.state });
  }

  setBusy(isBusy: boolean): void {
    this.setState({ ...this.state, isBusy });
  }

  setItems(items: any[]): void {
    this.setState({ ...this.state, data: [...this.state.data, ...items], isBusy: false });
  }
}
