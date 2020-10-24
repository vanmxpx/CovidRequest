import { NgModule } from '@angular/core';
import { FileNameDirective } from '@cov/shared/directives/file-name.directive';
import { IntegerDirective } from './integer-input.directive';

@NgModule({
    declarations: [
        FileNameDirective,
        IntegerDirective
    ],
    exports: [
        FileNameDirective,
        IntegerDirective
    ]
})
export class CovDirectivesModule { }
