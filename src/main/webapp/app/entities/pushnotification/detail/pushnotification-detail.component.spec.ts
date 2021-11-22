import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PushnotificationDetailComponent } from './pushnotification-detail.component';

describe('Component Tests', () => {
  describe('Pushnotification Management Detail Component', () => {
    let comp: PushnotificationDetailComponent;
    let fixture: ComponentFixture<PushnotificationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PushnotificationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ pushnotification: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PushnotificationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PushnotificationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load pushnotification on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pushnotification).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
