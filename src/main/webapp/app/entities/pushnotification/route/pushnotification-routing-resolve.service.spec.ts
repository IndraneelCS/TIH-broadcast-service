jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPushnotification, Pushnotification } from '../pushnotification.model';
import { PushnotificationService } from '../service/pushnotification.service';

import { PushnotificationRoutingResolveService } from './pushnotification-routing-resolve.service';

describe('Pushnotification routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PushnotificationRoutingResolveService;
  let service: PushnotificationService;
  let resultPushnotification: IPushnotification | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PushnotificationRoutingResolveService);
    service = TestBed.inject(PushnotificationService);
    resultPushnotification = undefined;
  });

  describe('resolve', () => {
    it('should return IPushnotification returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPushnotification = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPushnotification).toEqual({ id: 123 });
    });

    it('should return new IPushnotification if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPushnotification = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPushnotification).toEqual(new Pushnotification());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Pushnotification })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPushnotification = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPushnotification).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
