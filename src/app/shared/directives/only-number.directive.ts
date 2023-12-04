import {Directive, HostListener, OnInit, Input} from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective implements OnInit {

  characterLimit!: number;
  @Input('appOnlyNumber') onlyNumber: any;

  constructor() {
  }

  ngOnInit(): void {
    if (this.onlyNumber === 'phoneNumber') {
      this.characterLimit = 10;
      return;
    }
    this.characterLimit = 12;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: any): any {
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)) ||
      e.target.value.length >= this.characterLimit
    ) {
      e.preventDefault();
    }
  }
}
