import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPushnotification, Pushnotification } from '../pushnotification.model';
import { PushnotificationService } from '../service/pushnotification.service';

@Component({
  selector: 'jhi-pushnotification-update',
  templateUrl: './pushnotification-update.component.html',
})
export class PushnotificationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fanLevel: [],
    priority: [],
    messageHeader: [],
    message: [],
    timestamp: [],
  });

  constructor(
    protected pushnotificationService: PushnotificationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pushnotification }) => {
      if (pushnotification.id === undefined) {
        const today = dayjs().startOf('day');
        pushnotification.timestamp = today;
      }

      this.updateForm(pushnotification);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pushnotification = this.createFromForm();
    if (pushnotification.id !== undefined) {
      this.subscribeToSaveResponse(this.pushnotificationService.update(pushnotification));
    } else {
      this.subscribeToSaveResponse(this.pushnotificationService.create(pushnotification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPushnotification>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pushnotification: IPushnotification): void {
    this.editForm.patchValue({
      id: pushnotification.id,
      fanLevel: pushnotification.fanLevel,
      priority: pushnotification.priority,
      messageHeader: pushnotification.messageHeader,
      message: pushnotification.message,
      timestamp: pushnotification.timestamp ? pushnotification.timestamp.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IPushnotification {
    return {
      ...new Pushnotification(),
      id: this.editForm.get(['id'])!.value,
      fanLevel: this.editForm.get(['fanLevel'])!.value,
      priority: this.editForm.get(['priority'])!.value,
      messageHeader: this.editForm.get(['messageHeader'])!.value,
      message: this.editForm.get(['message'])!.value,
      timestamp: this.editForm.get(['timestamp'])!.value ? dayjs(this.editForm.get(['timestamp'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
