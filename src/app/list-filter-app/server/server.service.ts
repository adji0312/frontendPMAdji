import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {
    this.http = http;
   }

   private baseUrl = `${environment.baseUrl}/role`;
}
