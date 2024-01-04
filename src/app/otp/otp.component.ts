import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  isKeydownOn = false;
  loading = false;
  partner: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initFormOTP();
    this.resendCounter = 3;
    this.numberLimit = 3;
    this.processCountDown(0, 180);
  }

  initFormOTP(): void {
    const validators = [Validators.required, Validators.pattern(/^\d$/)];
    this.OTPForm = this.fb.group({
      input0: ['', validators],
      input1: ['', validators],
      input2: ['', validators],
      input3: ['', validators],
      input4: ['', validators],
      input5: ['', validators],
    });
  }

  processCountDown(currentTime: number, expiredTime: number): void {
    this.count = expiredTime - currentTime;
    this.counter$ = timer(0, 1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
  }

  getOTPValue() {
    let OTPValue = '';
    Object.keys(this.OTPForm.controls).forEach(key => {
      OTPValue += this.OTPForm.get(key)?.value;
    });
    return OTPValue;
  }

  onFocus(event: FocusEvent, inputId: number) {
    if (this.getOTPValue().length === 0) {
      event.preventDefault();
      const element = this.renderer.selectRootElement(`#input0`);
      element.focus();
    } else {
      const element = this.renderer.selectRootElement(`#input${inputId}`);
      element.select();
    }
  }

  isValidNumberString(value: any): boolean {
    return /^\d+$/.test(value);
  }

  onPaste(event: ClipboardEvent, inputId: number): void {
    event.preventDefault();
    // console.log('onPaste', event);
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text').trim();
    this.handlePastedText(pastedText, inputId);
  }

  // This function handles phone keyboard's clipboard event while avoid tampering keyup events
  // Note:
  // Gboard's clipboard event triggers 1 input event whose value is the whole OTP
  // iPhone keyboard's clipboard event triggers 6 input events whose value are each digit of OTP respectively
  onInput(event: any, inputId: number): void {
    event.preventDefault();
    if (this.isKeydownOn) {
      return;
    }
    // console.log('onInput', event);
    const pastedText = event.target.value.toString().trim();
    this.handlePastedText(pastedText, inputId);
  }

  onKeydown(event: KeyboardEvent, inputId: number): void {
    if (isNaN(Number(event.key)) && event.key !== 'Backspace') {
      return;
    }
    this.isKeydownOn = true;
    // console.log('onKeydown', event);
    const control = this.OTPForm.controls[`input${inputId}`];
    if (control) {
      control.patchValue(event.key === 'Backspace' ? '' : event.key);
    }
    const nextInputId = event.key === 'Backspace' ? Math.max(0, inputId - 1) : Math.min(5, inputId + 1);
    const selector = `#input${nextInputId}`;
    const element = this.renderer.selectRootElement(selector);
    if (element) {
      element.focus();
    }
  }

  onKeypress(event: KeyboardEvent, inputId: number) {
    event.preventDefault();
    // console.log('onKeypress', event);
  }

  onKeyup(event: KeyboardEvent, inputId: number) {
    this.isKeydownOn = false;
    // console.log('onKeyup', event);
  }

  handlePastedText(pastedText: string, inputId: number) {
    const OTPFormControls = this.OTPForm.controls;
    // If it's the iPhone clipboard event
    if (this.isValidNumberString(pastedText)) {
      const OTPNumbers = pastedText.split('') || [];
      const length = Math.min(OTPNumbers.length + inputId, 6);
      for (let i = inputId; i < length; i++) {
        OTPFormControls[`input${i}`].patchValue(OTPNumbers[i - inputId]);
      }
      const element = this.renderer.selectRootElement(`#input${Math.min(length + inputId, length)}`);
      if (element) {
        element.focus();
      }
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
    let OTPValue = this.getOTPValue();
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
