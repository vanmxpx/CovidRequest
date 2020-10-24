import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CovidRequest } from '@cov/shared/models/BL/covid-request';

@Component({
    selector: 'cov-page-template',
    templateUrl: './cov-page-template.component.html',
    styleUrls: ['./cov-page-template.component.scss']
})
export class CovPageTemplateComponent implements OnInit {

    @Input() public request: CovidRequest;
    @Input() public scale: number;
    constructor() { }

    ngOnInit() {
    }

}
