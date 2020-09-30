import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}


export function host(): string {
    return environment.host;
}

const providers = [
    { provide: 'host', useFactory: host, deps: [] }
];

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
