import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Check if the request is going to our own API
  const isApiUrl = req.url.startsWith(environment.apiUrl);

  // If we have a token and it's an API request, clone the request and add the auth header
  if (token && isApiUrl) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Pass the cloned request to the next handler
    return next(authReq);
  }

  // If no token or not an API request, pass the original request along
  return next(req);
};