import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPushnotification, getPushnotificationIdentifier } from '../pushnotification.model';

export type EntityResponseType = HttpResponse<IPushnotification>;
export type EntityArrayResponseType = HttpResponse<IPushnotification[]>;

@Injectable({ providedIn: 'root' })
export class PushnotificationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pushnotifications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pushnotification: IPushnotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pushnotification);
    return this.http
      .post<IPushnotification>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pushnotification: IPushnotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pushnotification);
    return this.http
      .put<IPushnotification>(`${this.resourceUrl}/${getPushnotificationIdentifier(pushnotification) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(pushnotification: IPushnotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pushnotification);
    return this.http
      .patch<IPushnotification>(`${this.resourceUrl}/${getPushnotificationIdentifier(pushnotification) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPushnotification>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPushnotification[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPushnotificationToCollectionIfMissing(
    pushnotificationCollection: IPushnotification[],
    ...pushnotificationsToCheck: (IPushnotification | null | undefined)[]
  ): IPushnotification[] {
    const pushnotifications: IPushnotification[] = pushnotificationsToCheck.filter(isPresent);
    if (pushnotifications.length > 0) {
      const pushnotificationCollectionIdentifiers = pushnotificationCollection.map(
        pushnotificationItem => getPushnotificationIdentifier(pushnotificationItem)!
      );
      const pushnotificationsToAdd = pushnotifications.filter(pushnotificationItem => {
        const pushnotificationIdentifier = getPushnotificationIdentifier(pushnotificationItem);
        if (pushnotificationIdentifier == null || pushnotificationCollectionIdentifiers.includes(pushnotificationIdentifier)) {
          return false;
        }
        pushnotificationCollectionIdentifiers.push(pushnotificationIdentifier);
        return true;
      });
      return [...pushnotificationsToAdd, ...pushnotificationCollection];
    }
    return pushnotificationCollection;
  }

  protected convertDateFromClient(pushnotification: IPushnotification): IPushnotification {
    return Object.assign({}, pushnotification, {
      timestamp: pushnotification.timestamp?.isValid() ? pushnotification.timestamp.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? dayjs(res.body.timestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pushnotification: IPushnotification) => {
        pushnotification.timestamp = pushnotification.timestamp ? dayjs(pushnotification.timestamp) : undefined;
      });
    }
    return res;
  }
}
