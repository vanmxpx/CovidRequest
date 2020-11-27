import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from './shared/helpers';
import { MaterialModule } from './material.module';
import { LoginModule } from './components/login/login.module';
import { JwtModule } from '@auth0/angular-jwt/lib/angular-jwt.module';
import { MainModule } from './components/main/main.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RegistrationModule } from './components/registration/registration.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        MainModule,
        MaterialModule,
        BrowserModule,
        LoginModule,
        RegistrationModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
