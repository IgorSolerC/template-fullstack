import { Injectable } from '@angular/core';
import { HttpClient as httpClient } from '@angular/common/http';
import { Example, ExampleCreate } from '../../domain/models/example';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private apiUrl = `${environment.apiUrl}/examples`;
  
  constructor(private http: httpClient) { }

  getExamples(): Observable<Example[]> {
    return this.http.get<Example[]>(this.apiUrl);
  }

  getExampleById(id: number): Observable<Example> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Example>(url);
  }
  
  createExample(example: ExampleCreate): Observable<Example> {
    return this.http.post<Example>(this.apiUrl, example);
  }
}
