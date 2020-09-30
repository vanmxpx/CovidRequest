import { Component, OnInit } from '@angular/core';
import { GeneratorPage } from '@cov/shared/constants/generator-page';
import { covAnimations } from './cov-animations';

@Component({
    selector: 'cov-generator',
    templateUrl: './cov-generator.component.html',
    styleUrls: ['./cov-generator.component.scss'],
    animations: [covAnimations.translateTab],
})
export class CovGeneratorComponent implements OnInit {
    GeneratorPage = GeneratorPage;
    selectedPage: GeneratorPage = GeneratorPage.Table;
    constructor() { }

    ngOnInit() {
    }

    selectPage(selectedView: GeneratorPage): void {
        this.selectedPage = selectedView;

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
