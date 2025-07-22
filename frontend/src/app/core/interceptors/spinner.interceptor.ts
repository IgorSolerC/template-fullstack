import { HttpInterceptorFn } from '@angular/common/http';
import { SpinnerControlService } from '../services/spinner-control.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BYPASS_SPINNER, CACHEABLE_REQUEST } from './http.context';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerControlService = inject(SpinnerControlService);

  // Skip the spinner if the context is set to bypass
  if (req.context.get(BYPASS_SPINNER)) {
    return next(req);
  }

  // Show the spinner
  spinnerControlService.show();

  // Hide the spinner on completion
  return next(req).pipe(
    finalize(() => spinnerControlService.hide())
  );
};
