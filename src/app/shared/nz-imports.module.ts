import {NgModule} from '@angular/core';
import {en_US, NZ_DATE_LOCALE, NZ_I18N} from 'ng-zorro-antd/i18n';
import {enUS} from 'date-fns/locale';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NzUploadModule} from 'ng-zorro-antd/upload';

@NgModule({
  imports: [
    NzSwitchModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzFormModule,
    NzCollapseModule,
    NzDropDownModule,
    NzIconModule,
    NzPopoverModule,
    NzDividerModule,
    NzTableModule,
    NzPaginationModule,
    NzToolTipModule,
    NzModalModule,
    NzNotificationModule,
    NzUploadModule,
  ],
  exports: [
    NzSwitchModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzFormModule,
    NzCollapseModule,
    NzDropDownModule,
    NzIconModule,
    NzPopoverModule,
    NzDividerModule,
    NzTableModule,
    NzPaginationModule,
    NzToolTipModule,
    NzModalModule,
    NzNotificationModule,
    NzUploadModule,
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {provide: NZ_DATE_LOCALE, useValue: enUS},
  ],
  declarations: []
})
export class NzImportsModule {
}
