import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CovDirectivesModule } from '@cov/shared/directives/cov-directves.module';
import { MaterialModule } from '@cov/material.module';
import { CovGeneratorComponent } from './cov-generator.component';
import { CovPageTableComponent } from './cov-page-table/cov-page-table.component';
import { CovPagePrintComponent } from './cov-page-print/cov-page-print.component';
import { CovPageSecondaryTableComponent } from './cov-page-secondary-table/cov-page-secondary-table.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CovPageTemplateComponent } from './cov-page-print/cov-page-template/cov-page-template.component';

@NgModule({
  declarations: [
    CovGeneratorComponent,
    CovPageTableComponent,
    CovPageSecondaryTableComponent,
    CovPagePrintComponent,
    CovPageTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CovDirectivesModule
  ],
  exports: [
      CovGeneratorComponent,
      CovPageTableComponent,
      CovPageSecondaryTableComponent,
      CovPagePrintComponent,
      CovPageTemplateComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } },
  ]
})
export class CovGeneratorModule { }
