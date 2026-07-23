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
      if (!this.state.data.length) {
         return;
      }

      const updatedData = [...this.state.data];

      updatedData[this.state.index] = {
         ...updatedData[this.state.index],
         user: text
      };

      this.setState({
         ...this.state,
         data: updatedData
      });
   }

   setBotText(text: string) {
      const updatedData = [...this.state.data];

      updatedData[this.state.index] = {
         ...updatedData[this.state.index],
         bod: text
      };

      this.setState({
         ...this.state,
         data: updatedData
      });
      this.state.index++;
   }

   addItems(items: any[]): void {
      this.setState({ ...this.state, data: [...this.state.data, ...items], isBusy: false });
   }

   setSelectedItem(item: any): void {
      this.setState({ ...this.state, selectedItem: item });
   }

}
