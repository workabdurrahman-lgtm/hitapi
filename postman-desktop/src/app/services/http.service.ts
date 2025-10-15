import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string };
  body?: any;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  makeRequest(method: string, url: string, options: RequestOptions = {}): Observable<HttpResponse<any>> {
    const { headers, params, body } = options;

    const httpOptions = {
      headers: new HttpHeaders(headers),
      params: new HttpParams({ fromObject: params }),
      observe: 'response' as 'response',
      body: body
    };

    return this.http.request(method, url, httpOptions);
  }
}