import { Injectable } from '@angular/core';
import { Store } from './store';
import { MNS270Fileds } from '../shared/models';

class JobsState {
   isBusy: boolean = false;
   data: MNS270Fileds[] = [];
}

@Injectable({
   providedIn: 'root'
})
export class JobsStore extends Store<JobsState> {
   constructor() {
      super(new JobsState());
   }

  reset(): void {
   this.setState({ ...this.state, ...new JobsState() });
  }

  clearRowSelection(): void {
   this.setState({ ...this.state});
  }

  setBusy(isBusy: boolean): void {
   this.setState({ ...this.state, isBusy });
  }

  setItems(items: any[]): void {
   this.setState({ ...this.state, data: items, isBusy: false });
  }

}
