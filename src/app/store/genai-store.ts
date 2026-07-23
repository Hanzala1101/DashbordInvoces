import { Injectable } from '@angular/core';
import { Store } from './store';
import { GenAiFileds } from '../shared/models';

class GenAiState {
   isBusy: boolean = false;
   isopen: boolean = false;
   data: GenAiFileds[] = [];
   selectedItem: any = null;
   index = 0;
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
      const existingItem = updatedData[this.state.index];

      if (existingItem) {
         existingItem.user = text;
      } else {
         updatedData.push({ user: text, bod: '' } as GenAiFileds);
      }

      this.setState({ ...this.state, data: updatedData });
   }

   setBotText(text: string) {
      const updatedData = [...this.state.data];
      const existingItem = updatedData[this.state.index];

      if (existingItem) {
         existingItem.bod = text;
      } else {
         updatedData.push({ user: '', bod: text } as GenAiFileds);
      }

      this.setState({ ...this.state, data: updatedData });
      this.state.index++;
   }

   addItems(items: any[]): void {
      this.setState({ ...this.state, data: [...this.state.data, ...items], isBusy: false });
   }

   setSelectedItem(item: any): void {
      this.setState({ ...this.state, selectedItem: item });
   }

}
