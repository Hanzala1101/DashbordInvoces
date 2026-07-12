import { APP_INITIALIZER, NgModule } from '@angular/core';
import { UserService } from '@infor-up/m3-odin-angular';
import { GlobalStore } from './store/global-store';
import { Translations } from './labels/translations';
import { from, of, switchMap, tap } from 'rxjs';
import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { Events } from './shared/constants';
import { DateUtil } from './shared/utils';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (
        userService: UserService,
        globalStore: GlobalStore,
        eventService: EventService,
      ) => {
        Soho.Locale.culturesPath = 'assets/ids-enterprise/js/cultures/';
        let language = '';
        return () => {
          return userService.getUserContext().pipe(
            tap({
              next: (userContext) => globalStore.setUserContext(userContext),
            }),
            switchMap((userContext) => {
              //   language = userContext.currentLanguage.toLowerCase();
              //   // IDS uses sv for swedish language while m3 uses se
              //   if (language === 'se') {
              //     language = 'sv';
              //   }
              const rawLang = userContext.currentLanguage ?? 'en';
              language = String(rawLang).toLowerCase();

              // Use english if language is not supported or is set to gb.
              if (!Translations[language] || language === 'gb') {
                return of('en');
              }

              //  return from(Soho.Locale.getLocale(language));
              return of(language);
            }),
            switchMap((languageTag: string) => {
              if (languageTag === 'en') {
                return from(Soho.Locale.set('en')).pipe(
                  tap({
                    next: () => {
                      Soho.Locale.setLanguage('en');
                      Soho.Locale.extendTranslations(
                        'en',
                        Translations['gb'].messages,
                      );
                    },
                  }),
                );
              }

              return from(Soho.Locale.set(language)).pipe(
                tap({
                  next: () => {
                    try {
                      Soho.Locale.setLanguage(language);
                      Soho.Locale.extendTranslations(
                        language,
                        Translations[language].messages,
                      );
                    } catch {
                      Soho.Locale.setLanguage(languageTag);
                      Soho.Locale.extendTranslations(
                        languageTag,
                        Translations[language].messages,
                      );
                    }
                  },
                }),
              );
            }),
            // Get global data
            switchMap(() => {
              const today = new Date();
              const defaultDate = DateUtil.formatDateForInput(today);
              const initialDate = globalStore.date || defaultDate;
              globalStore.setDate(initialDate);
              //   eventService.emit(Events.dateSelected, initialDate);
              return of(undefined);
            }),
          );
        };
      },
      deps: [UserService, GlobalStore, DataService, EventService],
    },
  ],
})
export class AppInitializerModule {}
