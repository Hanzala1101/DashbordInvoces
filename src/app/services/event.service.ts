// tslint:disable: object-literal-shorthand
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Events } from '../shared/constants';

interface IEvent {
  eventName: string;
  params: any;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly events$ = new Subject<any>();

  constructor() {}

  on(eventName: string, action: any): Subscription {
    return this.events$
      .pipe(
        filter((e: IEvent) => e.eventName === eventName),
        map((e: IEvent) => e.params),
      )
      .subscribe(action);
  }

  emit(eventName: Events, params: any = {}): void {
    this.events$.next({
      eventName: eventName,
      params: params,
    } as IEvent);
  }
}
