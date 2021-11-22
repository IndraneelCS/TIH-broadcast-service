import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'notification',
        data: { pageTitle: 'Notifications' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      {
        path: 'pushnotification',
        data: { pageTitle: 'Pushnotifications' },
        loadChildren: () => import('./pushnotification/pushnotification.module').then(m => m.PushnotificationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
