import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CovDirectivesModule } from '@cov/shared/directives/cov-directves.module';
import { MaterialModule } from '@cov/material.module';
import { CovGeneratorComponent } from './cov-generator/cov-generator.component';
import { CovGeneratorModule } from './cov-generator/cov-generator.module';
import { CovNavHeaderComponent } from './cov-nav-header/cov-nav-header.component';

@NgModule({
  declarations: [
    MainComponent,
    CovNavHeaderComponent
  ],
  imports: [
    CovGeneratorModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CovDirectivesModule
  ]
})
export class MainModule { }
