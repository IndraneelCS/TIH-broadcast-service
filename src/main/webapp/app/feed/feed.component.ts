import { Component, OnInit } from '@angular/core';
import { PushnotificationService } from '../entities/pushnotification/service/pushnotification.service';

@Component({
  selector: 'jhi-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  feed = true;

  constructor(protected pushnotificationService: PushnotificationService) {
    this.feed = true;
  }

  ngOnInit(): void {
    this.feed = true;
  }

  save(): void {
    this.pushnotificationService.create;
  }
}
