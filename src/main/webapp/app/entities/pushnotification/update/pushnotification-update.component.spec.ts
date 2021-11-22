jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PushnotificationService } from '../service/pushnotification.service';
import { IPushnotification, Pushnotification } from '../pushnotification.model';

import { PushnotificationUpdateComponent } from './pushnotification-update.component';

describe('Component Tests', () => {
  describe('Pushnotification Management Update Component', () => {
    let comp: PushnotificationUpdateComponent;
    let fixture: ComponentFixture<PushnotificationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pushnotificationService: PushnotificationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PushnotificationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PushnotificationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PushnotificationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pushnotificationService = TestBed.inject(PushnotificationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const pushnotification: IPushnotification = { id: 456 };

        activatedRoute.data = of({ pushnotification });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pushnotification));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pushnotification>>();
        const pushnotification = { id: 123 };
        jest.spyOn(pushnotificationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pushnotification });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pushnotification }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pushnotificationService.update).toHaveBeenCalledWith(pushnotification);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pushnotification>>();
        const pushnotification = new Pushnotification();
        jest.spyOn(pushnotificationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pushnotification });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pushnotification }));
        saveSubject.complete();

        // THEN
        expect(pushnotificationService.create).toHaveBeenCalledWith(pushnotification);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pushnotification>>();
        const pushnotification = { id: 123 };
        jest.spyOn(pushnotificationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pushnotification });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pushnotificationService.update).toHaveBeenCalledWith(pushnotification);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
