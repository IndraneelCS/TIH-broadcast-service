import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPushnotification } from '../pushnotification.model';
import { PushnotificationService } from '../service/pushnotification.service';

@Component({
  templateUrl: './pushnotification-delete-dialog.component.html',
})
export class PushnotificationDeleteDialogComponent {
  pushnotification?: IPushnotification;

  constructor(protected pushnotificationService: PushnotificationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pushnotificationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
