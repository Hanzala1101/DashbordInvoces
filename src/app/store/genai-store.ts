import { Injectable } from '@angular/core';
import { Store } from './store';
import { GenAiFileds } from '../shared/models';

class GenAiState {
   isBusy: boolean = false;
   isopen: boolean = false;
   data: GenAiFileds[] = [];
   selectedItem: any = null;
}


@Injectable({
   providedIn: 'root'
})
export class GenAiStore extends Store<GenAiState> {
   constructor() {
      super(new GenAiState());
   }

   reset(): void {
      this.setState({ ...this.state, ...new GenAiState() });
   }

   clearRowSelection(): void {
      this.setState({ ...this.state });
   }

   setBusy(isBusy: boolean): void {
      this.setState({ ...this.state, isBusy });
   }

   setItems(items: any[]): void {
      this.setState({ ...this.state, data: items, isBusy: false });
   }

   setuserText(text: string) {
      const updatedData = [...this.state.data];
      const existingItem = updatedData[0];

      if (existingItem) {
         existingItem.userText = text;
      } else {
         updatedData.push({ userText: text, bodText: '' } as GenAiFileds);
      }

      this.setState({ ...this.state, data: updatedData });
   }

   setBotText(text: string) {
      const updatedData = [...this.state.data];
      const existingItem = updatedData[updatedData.length - 1];

      if (existingItem) {
         existingItem.bodText = text;
      } else {
         updatedData.push({ userText: '', bodText: text } as GenAiFileds);
      }

      this.setState({ ...this.state, data: updatedData });
   }

   addItems(items: any[]): void {
      this.setState({ ...this.state, data: [...this.state.data, ...items], isBusy: false });
   }

   setSelectedItem(item: any): void {
      this.setState({ ...this.state, selectedItem: item });
   }

}
