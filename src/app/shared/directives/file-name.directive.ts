import { Directive, ElementRef, Inject, HostListener } from '@angular/core';
@Directive({
  selector: '[fileName]'
})
export class FileNameDirective {
  private el: HTMLInputElement;
  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

    @HostListener('keypress', ['$event'])
    onKeypress(evt) {
        let theEvent = evt || window.event;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        let regex = /^([a-zA-Z0-9\_\.]+)$/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) {
                theEvent.preventDefault();
            }
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event) {
        if (!event) {
            return;
        }
        if (event.preventDefault) {
            event.preventDefault();
        }

    }
}
