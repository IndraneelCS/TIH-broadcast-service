import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NotificationComponent } from './list/notification.component';
import { NotificationDetailComponent } from './detail/notification-detail.component';
import { NotificationRoutingModule } from './route/notification-routing.module';

@NgModule({
  imports: [SharedModule, NotificationRoutingModule],
  declarations: [NotificationComponent, NotificationDetailComponent],
})
export class NotificationModule {}
