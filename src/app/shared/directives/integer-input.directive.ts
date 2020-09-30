import { Directive, ElementRef, Inject, HostListener } from '@angular/core';

@Directive({
    selector: '[integer]'
})
export class IntegerDirective {
    private el: HTMLInputElement;
​
    constructor(@Inject(ElementRef) private elementRef: ElementRef) { // , private ngModel: NgModel TODO: handle ngModle changes
        this.el = this.elementRef.nativeElement;
    }
    @HostListener('ngModelChange', ['$event'])
    onChanged(event) {
        if (!event) {
            this.el.value = '';
            // this.ngModel.update.next(this.el.value); // TODO: handle ngModle changes
            return;
        }
        // let regex = /^\d+$/;
        let regex = /^-?([0-9]|[12]\d|3[0])$/;
        if (regex.test(event)) {
            return;
        }
​
        this.el.value = '';
        // this.ngModel.update.next(this.el.value); TODO: handle ngModle changes
​
    }
​
    @HostListener('paste', ['$event'])
    onPaste(event) {
        if (!event) {
            return;
        }
        let value = '';
        if (event.clipboardData) {
            value = event.clipboardData.getData('text/plain');
        } else {
            if ((<any>window).clipboardData) {
                value = (<any>window).clipboardData.getData('Text');
            }
        }
​
        if (!value) {
            return;
        }
        let pattern = /^-?([0-9]|[12]\d|3[0])$/;
        if (!pattern.test(value)) {
​
            if (event.preventDefault) {
                event.preventDefault();
            }
        }
    }
​
    @HostListener('keypress', ['$event'])
    onKeypress(evt) {
        let theEvent = evt || window.event;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        let regex = /[0-9]|-/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) {
                theEvent.preventDefault();
            }
        }
    }
}
