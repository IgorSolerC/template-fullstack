import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerControlService {
  // Inject the library's service
  private spinnerService = inject(NgxSpinnerService);

  private requestCount = 0;

  /**
   * Shows the spinner if it's the first active request.
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.spinnerService.show();
    }
  }

  /**
   * Hides the spinner if it's the last active request.
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0; // Reset
      this.spinnerService.hide();
    }
  }
}
