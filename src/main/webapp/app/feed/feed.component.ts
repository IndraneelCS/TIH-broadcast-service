import { Component, OnInit } from '@angular/core';
import { PushnotificationService } from '../entities/pushnotification/service/pushnotification.service';
import { IPushnotification, Pushnotification } from '../entities/pushnotification/pushnotification.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../config/input.constants';

@Component({
  selector: 'jhi-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  feed = true;
  isSaving = false;

  pushnotification1 = this.createFromForm('Amateur', 'Goal', 'LAST MINUTE GOAL!', 'Renegades have won it at the very last minute');
  pushnotification2 = this.createFromForm('Casual', 'All', 'Robbed off a Goal', 'Defender checks the run to prevent a goal');
  pushnotification3 = this.createFromForm('Professional', 'All', 'Fastest run in the AFL', 'Nick hand runs at a speed of 36km/hr!!');
  pushnotification4 = this.createFromForm(
    'Professional',
    'All',
    'Leader in Contested Marks',
    'Aaron Naughton leads the league in Contested Marks'
  );

  constructor(protected pushnotificationService: PushnotificationService) {
    this.feed = true;
  }

  ngOnInit(): void {
    this.feed = true;
  }

  save(): void {
    this.pushnotificationService.create;
  }

  previousState(): void {
    window.history.back();
  }

  click1(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.pushnotificationService.create(this.pushnotification1));
    this.subscribeToSaveResponse(this.pushnotificationService.create(this.pushnotification2));
    this.subscribeToSaveResponse(this.pushnotificationService.create(this.pushnotification3));
    this.subscribeToSaveResponse(this.pushnotificationService.create(this.pushnotification4));
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

  protected createFromForm(fanLevel: string, priority: string, header: string, message: string): IPushnotification {
    return {
      ...new Pushnotification(),
      fanLevel: fanLevel,
      priority: priority,
      messageHeader: header,
      message: message,
      timestamp: dayjs(new Date()),
    };
  }
}
