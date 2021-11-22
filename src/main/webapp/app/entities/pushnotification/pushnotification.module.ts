import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PushnotificationComponent } from './list/pushnotification.component';
import { PushnotificationDetailComponent } from './detail/pushnotification-detail.component';
import { PushnotificationUpdateComponent } from './update/pushnotification-update.component';
import { PushnotificationDeleteDialogComponent } from './delete/pushnotification-delete-dialog.component';
import { PushnotificationRoutingModule } from './route/pushnotification-routing.module';

@NgModule({
  imports: [SharedModule, PushnotificationRoutingModule],
  declarations: [
    PushnotificationComponent,
    PushnotificationDetailComponent,
    PushnotificationUpdateComponent,
    PushnotificationDeleteDialogComponent,
  ],
  entryComponents: [PushnotificationDeleteDialogComponent],
})
export class PushnotificationModule {}
