import { HttpContext } from '@angular/common/http';
import { BYPASS_SPINNER, CACHEABLE_REQUEST } from '../../core/interceptors/http.context';

/**
 * Defines the user-friendly options that can be passed to a service method.
 */
export interface RequestOptions {
  showSpinner?: boolean;
  isCacheable?: boolean;
  // Add other future options here, e.g., apiVersion?: string;
}

/**
 * Creates an HttpOptions object containing an HttpContext based on the provided options.
 * This utility centralizes the logic for adding metadata to HTTP requests.
 *
 * @param options A dictionary of user-friendly options.
 * @returns An object with a 'context' property to be used in HttpClient requests.
 */
export function createHttpOptions(options: RequestOptions = {}): { context: HttpContext } {
  // Set default values for our options
  const { 
    showSpinner = true, 
    isCacheable = false 
  } = options;

  // Start with a new, empty context
  let context = new HttpContext();

  // Conditionally add tokens to the context based on the options.
  // HttpContext is immutable, so .set() returns a new instance.
  
  // Logic: The token is named BYPASS_SPINNER. So if `showSpinner` is `false`,
  // we set the `BYPASS_SPINNER` token to `true`.
  if (!showSpinner) {
    context = context.set(BYPASS_SPINNER, true);
  }

  // Logic: The token is named CACHEABLE_REQUEST. If `isCacheable` is `true`,
  // we set the `CACHEABLE_REQUEST` token to `true`.
  if (isCacheable) {
    context = context.set(CACHEABLE_REQUEST, true);
  }

  return { context };
}