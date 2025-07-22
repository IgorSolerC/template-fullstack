import { HttpContextToken } from '@angular/common/http';

/**
 * If set to true, the spinnerInterceptor will ignore this request.
 * Defaults to false (meaning the spinner WILL be shown).
 */
export const BYPASS_SPINNER = new HttpContextToken<boolean>(() => false);

/**
 * If set to true, a cachingInterceptor could use this to cache the request.
 * Defaults to false (meaning the request is not cacheable).
 */
export const CACHEABLE_REQUEST = new HttpContextToken<boolean>(() => false);

// Add more tokens here as the app grows 
// export const API_VERSION = new HttpContextToken<string>(() => 'v1');