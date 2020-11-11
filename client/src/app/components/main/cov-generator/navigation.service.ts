import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    generatorToolbarFixed = false;
    generatorToolbarOpened = true;
    constructor(
        private snackbar: MatSnackBar
    ) {
    }
    public closeGeneratorToolbar(userInitiated: boolean = false): void {
        if (!this.generatorToolbarOpened)
            return;

        this.generatorToolbarFixed = true;
        this.generatorToolbarOpened = false;
    }

    public openGeneratorToolbar(userInitiated: boolean = false): void {
        if (this.generatorToolbarFixed && !userInitiated)
            return;

        this.generatorToolbarFixed = false;
        this.generatorToolbarOpened = true;
    }
    public toogleGeneratorToolbar(userInitiated: boolean = false): void {
        this.generatorToolbarFixed = !this.generatorToolbarOpened;
        this.generatorToolbarOpened = !this.generatorToolbarOpened;
    }
}