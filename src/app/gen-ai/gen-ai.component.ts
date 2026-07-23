import { AfterViewInit, Component } from '@angular/core';
import { GenAiStore } from '../store/genai-store';
import { finalize, Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
   selector: 'app-gen-ai',
   templateUrl: './gen-ai.component.html',
   styleUrl: './gen-ai.component.css'
})
export class GenAiComponent implements AfterViewInit {
   state$!: Observable<any>;
   draftMessage = '';

   constructor(private store: GenAiStore, private datasirvice: DataService) {
      this.state$ = this.store.state$.pipe();

   }

   ngAfterViewInit(): void {
      this.datasirvice.getSession()
      this.store.setBotText("Hi, How can i assist you ?")
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

   get hasBotReply(): boolean {
      return this.data.some((item) => !!item.user);
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
      if (localStorage.getItem('chatsrv')) {
         this.store.setuserText(text);
         this.store.setBusy(true);
         this.datasirvice.askGenAI(text).pipe(finalize(() => this.store.setBusy(false)))
            .subscribe({
               next: (response) => {
                  // const botContent = response.body.content;
                  this.store.setBotText(response.body.content);
                  this.store.setBusy(false)
               },
               error: (error) => {
                  console.error('GenAI request failed:', error);
                  this.store.setBotText('Sorry, I could not get a response.');
               }
            });
      } else {
         $('body').toast({
            title: 'Session for Chat',
            message: 'Session not started yet Refresh...'
         });
         this.store.setBusy(true);
         this.store.setuserText(text);
      }
   }

   sendDraftMessage(): void {
      const text = this.draftMessage?.trim();
      if (!text) {
         return;
      }

      this.draftMessage = '';
      this.onClick(text);
   }
}
