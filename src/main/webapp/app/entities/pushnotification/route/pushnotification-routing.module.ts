import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PushnotificationComponent } from '../list/pushnotification.component';
import { PushnotificationDetailComponent } from '../detail/pushnotification-detail.component';
import { PushnotificationUpdateComponent } from '../update/pushnotification-update.component';
import { PushnotificationRoutingResolveService } from './pushnotification-routing-resolve.service';

const pushnotificationRoute: Routes = [
  {
    path: '',
    component: PushnotificationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PushnotificationDetailComponent,
    resolve: {
      pushnotification: PushnotificationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PushnotificationUpdateComponent,
    resolve: {
      pushnotification: PushnotificationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PushnotificationUpdateComponent,
    resolve: {
      pushnotification: PushnotificationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pushnotificationRoute)],
  exports: [RouterModule],
})
export class PushnotificationRoutingModule {}
