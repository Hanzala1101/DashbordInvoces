import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Log } from '@infor-up/m3-odin';
import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule } from 'ids-enterprise-ng'; // TODO Consider only importing individual SoHo modules in production
import { AppComponent } from './app.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MNS270Component } from './mns270/mns270.component';
import { MecFaliuresComponent } from './mec-faliures/mec-faliures.component';
import { InvoiceGenratedComponent } from './invoice-genrated/invoice-genrated.component';
import { AppInitializerModule } from './app-initializer.module';
import { GenAiComponent } from './gen-ai/gen-ai.component';

@NgModule({
  declarations: [
    AppComponent,
    MonitoringComponent,
    MNS270Component,
    MecFaliuresComponent,
    InvoiceGenratedComponent,
    GenAiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SohoComponentsModule,
    M3OdinModule,
    AppInitializerModule,
  ],
  // providers: [
  //    {
  //       provide: LOCALE_ID,
  //       useValue: 'en-US',
  //    },
  //    {
  //       provide: APP_INITIALIZER,
  //       multi: true,
  //       useFactory: (locale: string) => () => {
  //          Soho.Locale.culturesPath = 'assets/ids-enterprise/js/cultures/';
  //          return Soho.Locale.set(locale).catch(err => {
  //             Log.error('Failed to set IDS locale', err);
  //          });
  //       },
  //       deps: [LOCALE_ID],
  //    }
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
