import { AfterViewInit, Component } from '@angular/core';
import { GenAiStore } from '../store/genai-store';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
   selector: 'app-gen-ai',
   templateUrl: './gen-ai.component.html',
   styleUrl: './gen-ai.component.css'
})
export class GenAiComponent implements AfterViewInit {
   state$!: Observable<any>;

   constructor(private store: GenAiStore, private datasirvice: DataService) {
      this.state$ = this.store.state$;
   }

   ngAfterViewInit(): void {
      this.datasirvice.getSession()
   }

   get isOpen(): boolean {
      return this.store.state.isopen;
   }

   get data(): any[] {
      return this.store.state.data || [];
   }

   get selectedItem(): any {
      return this.store.state.selectedItem;
   }

   get chatMessages(): Array<{ type: 'bot' | 'user'; text: string }> {
      const messages: Array<{ type: 'bot' | 'user'; text: string }> = [];

      if (this.selectedItem) {
         messages.push({
            type: 'user',
            text: this.formatItem(this.selectedItem)
         });
      }

      if (this.data.length) {
         this.data.forEach((item) => {
            messages.push({
               type: 'bot',
               text: this.formatItem(item)
            });
         });
      } else {
         messages.push({
            type: 'bot',
            text: 'No invoice data available yet.'
         });
      }

      return messages;
   }

   toggleChat(): void {
      this.store.setState({ ...this.store.state, isopen: !this.store.state.isopen });
   }

   closeChat(): void {
      this.store.setState({ ...this.store.state, isopen: false });
   }

   private formatItem(item: any): string {
      if (!item) {
         return '';
      }

      if (typeof item === 'string') {
         return item;
      }

      if (item.userText) {
         return item.userText;
      }

      if (item.bodText) {
         return item.bodText;
      }

      return JSON.stringify(item);
   }

   onClick(text: string): void {
      if (localStorage.getItem('ChatSrv')) {
         this.store.setuserText(text);
         this.datasirvice.askGenAI(text).subscribe({
            next: (response) => {
               const botContent = response?.item.content || response?.item.message || '';
               this.store.setBotText(botContent);
            },
            error: (error) => {
               console.error('GenAI request failed:', error);
               this.store.setBotText('Sorry, I could not get a response.');
            }
         });
      } else {
         alert('session not yet started');
      }
   }
}
