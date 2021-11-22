import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PushnotificationService } from '../service/pushnotification.service';

import { PushnotificationComponent } from './pushnotification.component';

describe('Component Tests', () => {
  describe('Pushnotification Management Component', () => {
    let comp: PushnotificationComponent;
    let fixture: ComponentFixture<PushnotificationComponent>;
    let service: PushnotificationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PushnotificationComponent],
      })
        .overrideTemplate(PushnotificationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PushnotificationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PushnotificationService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.pushnotifications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
