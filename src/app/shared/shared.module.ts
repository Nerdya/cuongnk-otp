import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout';
import {OnlyNumberDirective} from './directives/only-number.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzImportsModule} from './nz-imports.module';

@NgModule({
  declarations: [
    OnlyNumberDirective,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NzImportsModule,
  ],
  exports: [
    OnlyNumberDirective,
    FormsModule,
    ReactiveFormsModule,
    NzImportsModule,
  ],
})
export class SharedModule {
}
