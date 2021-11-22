import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPushnotification, Pushnotification } from '../pushnotification.model';

import { PushnotificationService } from './pushnotification.service';

describe('Pushnotification Service', () => {
  let service: PushnotificationService;
  let httpMock: HttpTestingController;
  let elemDefault: IPushnotification;
  let expectedResult: IPushnotification | IPushnotification[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PushnotificationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fanLevel: 'AAAAAAA',
      priority: 'AAAAAAA',
      messageHeader: 'AAAAAAA',
      message: 'AAAAAAA',
      timestamp: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Pushnotification', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.create(new Pushnotification()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pushnotification', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fanLevel: 'BBBBBB',
          priority: 'BBBBBB',
          messageHeader: 'BBBBBB',
          message: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pushnotification', () => {
      const patchObject = Object.assign(
        {
          fanLevel: 'BBBBBB',
          priority: 'BBBBBB',
          messageHeader: 'BBBBBB',
          message: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        new Pushnotification()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pushnotification', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fanLevel: 'BBBBBB',
          priority: 'BBBBBB',
          messageHeader: 'BBBBBB',
          message: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Pushnotification', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPushnotificationToCollectionIfMissing', () => {
      it('should add a Pushnotification to an empty array', () => {
        const pushnotification: IPushnotification = { id: 123 };
        expectedResult = service.addPushnotificationToCollectionIfMissing([], pushnotification);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pushnotification);
      });

      it('should not add a Pushnotification to an array that contains it', () => {
        const pushnotification: IPushnotification = { id: 123 };
        const pushnotificationCollection: IPushnotification[] = [
          {
            ...pushnotification,
          },
          { id: 456 },
        ];
        expectedResult = service.addPushnotificationToCollectionIfMissing(pushnotificationCollection, pushnotification);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pushnotification to an array that doesn't contain it", () => {
        const pushnotification: IPushnotification = { id: 123 };
        const pushnotificationCollection: IPushnotification[] = [{ id: 456 }];
        expectedResult = service.addPushnotificationToCollectionIfMissing(pushnotificationCollection, pushnotification);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pushnotification);
      });

      it('should add only unique Pushnotification to an array', () => {
        const pushnotificationArray: IPushnotification[] = [{ id: 123 }, { id: 456 }, { id: 97472 }];
        const pushnotificationCollection: IPushnotification[] = [{ id: 123 }];
        expectedResult = service.addPushnotificationToCollectionIfMissing(pushnotificationCollection, ...pushnotificationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pushnotification: IPushnotification = { id: 123 };
        const pushnotification2: IPushnotification = { id: 456 };
        expectedResult = service.addPushnotificationToCollectionIfMissing([], pushnotification, pushnotification2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pushnotification);
        expect(expectedResult).toContain(pushnotification2);
      });

      it('should accept null and undefined values', () => {
        const pushnotification: IPushnotification = { id: 123 };
        expectedResult = service.addPushnotificationToCollectionIfMissing([], null, pushnotification, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pushnotification);
      });

      it('should return initial array if no Pushnotification is added', () => {
        const pushnotificationCollection: IPushnotification[] = [{ id: 123 }];
        expectedResult = service.addPushnotificationToCollectionIfMissing(pushnotificationCollection, undefined, null);
        expect(expectedResult).toEqual(pushnotificationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
