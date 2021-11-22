import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INotification } from '../notification.model';

import { NotificationService } from './notification.service';

describe('Notification Service', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let elemDefault: INotification;
  let expectedResult: INotification | INotification[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      fanLevel: 'AAAAAAA',
      priority: 'AAAAAAA',
      header: 'AAAAAAA',
      body: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should return a list of Notification', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fanLevel: 'BBBBBB',
          priority: 'BBBBBB',
          header: 'BBBBBB',
          body: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    describe('addNotificationToCollectionIfMissing', () => {
      it('should add a Notification to an empty array', () => {
        const notification: INotification = { id: 123 };
        expectedResult = service.addNotificationToCollectionIfMissing([], notification);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notification);
      });

      it('should not add a Notification to an array that contains it', () => {
        const notification: INotification = { id: 123 };
        const notificationCollection: INotification[] = [
          {
            ...notification,
          },
          { id: 456 },
        ];
        expectedResult = service.addNotificationToCollectionIfMissing(notificationCollection, notification);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Notification to an array that doesn't contain it", () => {
        const notification: INotification = { id: 123 };
        const notificationCollection: INotification[] = [{ id: 456 }];
        expectedResult = service.addNotificationToCollectionIfMissing(notificationCollection, notification);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notification);
      });

      it('should add only unique Notification to an array', () => {
        const notificationArray: INotification[] = [{ id: 123 }, { id: 456 }, { id: 54415 }];
        const notificationCollection: INotification[] = [{ id: 123 }];
        expectedResult = service.addNotificationToCollectionIfMissing(notificationCollection, ...notificationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const notification: INotification = { id: 123 };
        const notification2: INotification = { id: 456 };
        expectedResult = service.addNotificationToCollectionIfMissing([], notification, notification2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notification);
        expect(expectedResult).toContain(notification2);
      });

      it('should accept null and undefined values', () => {
        const notification: INotification = { id: 123 };
        expectedResult = service.addNotificationToCollectionIfMissing([], null, notification, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notification);
      });

      it('should return initial array if no Notification is added', () => {
        const notificationCollection: INotification[] = [{ id: 123 }];
        expectedResult = service.addNotificationToCollectionIfMissing(notificationCollection, undefined, null);
        expect(expectedResult).toEqual(notificationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
