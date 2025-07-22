import { Injectable } from '@angular/core';
import { HttpClient as httpClient, HttpContext } from '@angular/common/http';
import { Example, ExampleCreate } from '../../domain/models/example';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { createHttpOptions, RequestOptions } from '../../shared/utils/http.utils'

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private apiUrl = `${environment.apiUrl}/examples`;
  
  constructor(private http: httpClient) { }

  getExamples(options: RequestOptions = {}): Observable<Example[]> {
    return this.http.get<Example[]>(this.apiUrl, createHttpOptions(options));
  }

  getExampleById(id: number, options: RequestOptions = {}): Observable<Example> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Example>(url, createHttpOptions(options));
  }
  
  createExample(example: ExampleCreate,  options: RequestOptions = {}): Observable<Example> {
    return this.http.post<Example>(this.apiUrl, example, createHttpOptions(options));
  }

  deleteExample(id: number, options: RequestOptions = {}): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, createHttpOptions(options));
  }
  
}
