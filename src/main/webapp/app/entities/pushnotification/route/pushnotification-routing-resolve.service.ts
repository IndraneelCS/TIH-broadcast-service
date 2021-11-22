import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPushnotification, Pushnotification } from '../pushnotification.model';
import { PushnotificationService } from '../service/pushnotification.service';

@Injectable({ providedIn: 'root' })
export class PushnotificationRoutingResolveService implements Resolve<IPushnotification> {
  constructor(protected service: PushnotificationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPushnotification> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pushnotification: HttpResponse<Pushnotification>) => {
          if (pushnotification.body) {
            return of(pushnotification.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pushnotification());
  }
}
