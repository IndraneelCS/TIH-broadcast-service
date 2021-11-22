import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  service = true;
  constructor() {
    this.service = false;
  }
}
