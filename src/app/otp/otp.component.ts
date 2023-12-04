import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {timer} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OtpComponent implements OnInit {
  OTPForm!: FormGroup;
  resendCounter = 0;
  numberLimit = 0;
  counter$!: Observable<number>;
  count = 0;
  submitOTPFalse = false;
  OTPValid = true;
  OTPEmpty = false;
  isOTPVerified = false;
  pasted = false;
  loading = false;
  partner: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.initFormOTP();
    this.resendCounter = 3;
    this.numberLimit = 3;
    this.processCountDown(0, 180);
  }

  initFormOTP(): void {
    const validators = [Validators.required, Validators.pattern('^([0-9]{1})$')];
    this.OTPForm = new FormGroup({
      input0: new FormControl('', validators),
      input1: new FormControl('', validators),
      input2: new FormControl('', validators),
      input3: new FormControl('', validators),
      input4: new FormControl('', validators),
      input5: new FormControl('', validators),
    });
  }

  processCountDown(currentTime: number, expiredTime: number): void {
    this.count = expiredTime - currentTime;
    this.counter$ = timer(0, 1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
  }

  isValidOTP(value: any): boolean {
    return value.trim().length === 6 && !isNaN(Number(value));
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text').trim();
    if (this.isValidOTP(pastedText)) {
      const OTPFormControls = this.OTPForm.controls;
      const OTPNumbers = pastedText.split('') || [];
      for (let i = 0; i < 6; i++) {
        OTPFormControls[`input${i}`].patchValue(OTPNumbers[i]);
      }

      const element = this.renderer.selectRootElement('#input5');
      element.focus();
      this.pasted = true;
    }
    this.cdr.markForCheck();
  }

  iOSAutofill(event: any): void {
    if (this.pasted) {
      return;
    }
    const pastedText = event.target.value.toString().trim();
    if (this.isValidOTP(pastedText)) {
      const OTPFormControls = this.OTPForm.controls;
      const OTPNumbers = pastedText.split('') || [];
      for (let i = 0; i < 6; i++) {
        OTPFormControls[`input${i}`].patchValue(OTPNumbers[i]);
      }
    }
  }

  onKeyup(event: KeyboardEvent, inputId: number): void {
    if (isNaN(Number(event.key)) && event.key !== 'Backspace') {
      event.preventDefault();
      return;
    }

    const nextInputId = event.key === 'Backspace' ? Math.max(0, inputId - 1) : Math.min(5, inputId + 1);
    const selector = `#input${nextInputId}`;

    if (event.target instanceof HTMLElement && (event.target as HTMLInputElement).value.length === 1 || event.key === 'Backspace') {
      const control = this.OTPForm.controls[`input${inputId}`];
      if (control.value !== '') {
        control.patchValue(event.key === 'Backspace' ? '' : event.key);
      }
      const element = this.renderer.selectRootElement(selector);
      element.focus();
    }
  }

  resendOTP(): void {
    // this.loading = true;
    // const payload = {
    //   uuid: this.appointmentId,
    // };
    // this.ekycService.resendOTP(payload, false).subscribe({
    //     next: (res) => {
    //         if (res && res.status) {
    //             this.submitOTPFalse = false;
    //             this.OTPForm.reset();
    //             this.numberLimit = res.data.numberLimit;
    //             this.resendCounter = res.data?.count;
    //             // this.resendCounter = 3;
    //             const currentTime = res.data?.currentTime;
    //             const expiredTime = res.data?.expiredTime;
    //             this.processCountDown(currentTime, expiredTime);
    //         } else {
    //             this.notification.create( 'error', 'Đã có lỗi xảy ra! Vui lòng thử lại!', '');
    //             this.loading = false;
    //         }
    //         this.OTPValid = true;
    //     },
    //     error: (e) => {
    //         console.error(e);
    //         this.notification.create( 'error', 'Đã có lỗi xảy ra! Vui lòng thử lại!', '');
    //         this.loading = false;
    //     },
    //     complete: () => {
    //         this.loading = false;
    //     }
    // });
  }

  submitOTP(): void {
    if (!this.OTPForm.valid) {
      this.submitOTPFalse = false;
      const isEveryInputEmpty = Object.values(this.OTPForm.controls).every(control => !control.value);
      if (isEveryInputEmpty) {
        this.OTPEmpty = true;
        this.OTPValid = true;
        return;
      }
      this.OTPValid = false;
      this.OTPEmpty = false;
      return;
    }
    this.OTPEmpty = false;
    if (this.numberLimit === 0) {
      return;
    }
    this.loading = true;
    let OTPValue = '';
    Object.keys(this.OTPForm.controls).forEach(key => {
      OTPValue += this.OTPForm.get(key)?.value;
    });
    alert(OTPValue);
    this.toHome();
    // const payload = {
    //   uuid: this.appointmentId,
    //   appointmentId: this.appointmentId,
    //   otp: OTPValue,
    // };
    // this.ekycService.verifyOTP(payload, false).subscribe({
    //     next: (res) => {
    //         if (res && res.status) {
    //             if (res.data.status) {
    //                 if (this.isOTPVerified) {
    //                     return;
    //                 }
    //                 this.isOTPVerified = true;
    //                 localStorage.setItem(LocalEnum.TOKEN, res.data?.token);
    //                 localStorage.setItem(LocalEnum.SESSION_ID, res.data?.sessionVideoDto?.sessionId);
    //                 localStorage.setItem(LocalEnum.SESSION_KEY, res.data?.sessionVideoDto?.key);
    //                 localStorage.setItem(LocalEnum.SESSION_VIDEO_TOKEN, res?.data?.sessionVideoDto?.code);
    //                 localStorage.setItem(LocalEnum.SESSION_VIDEO_UID, res?.data?.sessionVideoDto?.subId);
    //                 this.connect(res.data?.sessionVideoDto?.key, res.data?.token);
    //                 console.log('---subId', Number(res?.data?.sessionVideoDto?.subId));
    //                 // Should be at submit or redirect (?)
    //                 if (sessionStorage.getItem(SessionEnum.IS_WAITING) === 'true') {
    //                     sessionStorage.setItem(SessionEnum.IS_WAITING, 'false');
    //                 }
    //                 if (sessionStorage.getItem(SessionEnum.IS_CALLING) === 'true') {
    //                     sessionStorage.setItem(SessionEnum.IS_CALLING, 'false');
    //                 }
    //                 // Navigate to call
    //                 this.toCall(res?.data?.sessionVideoDto?.sessionId, res?.data?.sessionVideoDto?.key,
    //                     res?.data?.sessionVideoDto?.code, Number(res?.data?.sessionVideoDto?.subId), this.agentId);
    //             } else {
    //                 this.OTPForm.reset();
    //                 this.numberLimit = res.data.numberLimit;
    //                 this.submitOTPFalse = true;
    //             }
    //         } else {
    //             this.notification.create('error', 'Đã có lỗi xảy ra! Vui lòng thử lại!', '');
    //             this.loading = false;
    //         }
    //         this.OTPValid = true;
    //     },
    //     error: (e) => {
    //         console.error(e);
    //         this.loading = false;
    //     },
    //     complete: () => {
    //         this.loading = false;
    //     }
    // });
  }

  back() {
    this.toHome();
  }

  toHome() {
    this.router.navigate(['/home']);
  }
}
