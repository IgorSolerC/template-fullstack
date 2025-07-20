import { HttpInterceptorFn } from '@angular/common/http';
import { SpinnerControlService } from '../services/spinner-control.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerControlService = inject(SpinnerControlService);

  // Show the spinner
  spinnerControlService.show();

  // Hide the spinner on completion
  return next(req).pipe(
    finalize(() => spinnerControlService.hide())
  );
};
