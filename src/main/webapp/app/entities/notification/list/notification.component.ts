import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { INotification } from '../notification.model';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'jhi-notification',
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  notifications?: INotification[];
  isLoading = false;

  constructor(protected notificationService: NotificationService) {}

  loadAll(): void {
    this.isLoading = true;

    this.notificationService.query().subscribe(
      (res: HttpResponse<INotification[]>) => {
        this.isLoading = false;
        this.notifications = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INotification): number {
    return item.id!;
  }
}
