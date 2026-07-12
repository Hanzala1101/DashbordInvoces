import { Injectable } from '@angular/core';
import { Store } from './store';
import { IUserContext } from '@infor-up/m3-odin';
import { DateUtil } from '../shared/utils';

class GlobalState {
  isBusy = false;
  userContext = {} as IUserContext;
  date = DateUtil.formatDateForInput(new Date());
}

@Injectable({ providedIn: 'root' })
export class GlobalStore extends Store<GlobalState> {
  constructor() {
    super(new GlobalState());
  }

  reset(): void {
    this.setState(new GlobalState());
  }

  setBusy(globalBusy: boolean): void {
    this.setState({ ...this.state, isBusy: globalBusy });
  }

  setUserContext(userContext: IUserContext): void {
    this.setState({ ...this.state, userContext });
  }

  /**
   * Set global data
   */
  setDate(date: string): void {
    this.setState({
      ...this.state,
      date: date,
    });
  }

  get userContext(): IUserContext {
    return this.state.userContext;
  }

  get date(): string {
    return this.state.date;
  }
}
