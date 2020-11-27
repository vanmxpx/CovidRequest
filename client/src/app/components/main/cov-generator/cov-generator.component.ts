import { Component, OnInit } from '@angular/core';
import { GeneratorPage } from '@cov/shared/constants/generator-page';
import { covAnimations } from './cov-animations';
import { CovidRequest } from '@cov/shared/models/BL/covid-request';
import { cm } from '@cov/shared/constants/covud-mockups';
import { NavigationService } from './navigation.service';

@Component({
    selector: 'cov-generator',
    templateUrl: './cov-generator.component.html',
    styleUrls: ['./cov-generator.component.scss'],
    animations: [covAnimations.translateTab],
})
export class CovGeneratorComponent implements OnInit {
    GeneratorPage = GeneratorPage;
    selectedPage: GeneratorPage = GeneratorPage.Table;
    requests: CovidRequest[] = cm(); // []; // 
    constructor(
        public navigationService: NavigationService
    ) { }

    ngOnInit() {
    }

    selectPage(selectedView: GeneratorPage): void {
        this.selectedPage = selectedView;
    }

    toogleToolbar() {
        this.navigationService.toogleGeneratorToolbar(true);
    }

    calculatePosition(index: number): 'center' | 'top' | 'bottom' {
        if (index === this.selectedPage) {
            return 'center';
        }
        if (index > this.selectedPage) {
            return 'bottom';
        }
        if (index < this.selectedPage) {
            return 'top';
        }
    }
}
