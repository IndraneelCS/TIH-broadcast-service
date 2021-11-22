import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPushnotification } from '../pushnotification.model';

@Component({
  selector: 'jhi-pushnotification-detail',
  templateUrl: './pushnotification-detail.component.html',
})
export class PushnotificationDetailComponent implements OnInit {
  pushnotification: IPushnotification | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pushnotification }) => {
      this.pushnotification = pushnotification;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
