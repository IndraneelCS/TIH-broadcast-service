import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPushnotification } from '../pushnotification.model';
import { PushnotificationService } from '../service/pushnotification.service';
import { PushnotificationDeleteDialogComponent } from '../delete/pushnotification-delete-dialog.component';

@Component({
  selector: 'jhi-pushnotification',
  templateUrl: './pushnotification.component.html',
})
export class PushnotificationComponent implements OnInit {
  pushnotifications?: IPushnotification[];
  isLoading = false;

  constructor(protected pushnotificationService: PushnotificationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pushnotificationService.query().subscribe(
      (res: HttpResponse<IPushnotification[]>) => {
        this.isLoading = false;
        this.pushnotifications = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPushnotification): number {
    return item.id!;
  }

  delete(pushnotification: IPushnotification): void {
    const modalRef = this.modalService.open(PushnotificationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pushnotification = pushnotification;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
