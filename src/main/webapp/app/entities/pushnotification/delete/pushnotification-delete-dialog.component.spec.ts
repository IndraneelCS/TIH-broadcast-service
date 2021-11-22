jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PushnotificationService } from '../service/pushnotification.service';

import { PushnotificationDeleteDialogComponent } from './pushnotification-delete-dialog.component';

describe('Component Tests', () => {
  describe('Pushnotification Management Delete Component', () => {
    let comp: PushnotificationDeleteDialogComponent;
    let fixture: ComponentFixture<PushnotificationDeleteDialogComponent>;
    let service: PushnotificationService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PushnotificationDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(PushnotificationDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PushnotificationDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PushnotificationService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        jest.spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
