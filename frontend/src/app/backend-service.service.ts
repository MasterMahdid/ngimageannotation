import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
export interface Iannotation {
  id?:string
  type?: string
  dnn_model?: string
  confidence?: number
  object?: string
  object_version?: string
  x?: number
  y?: number
  width?: number
  height?: number
}
@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  constructor(private http: HttpClient) { }

  getAnnotations():Observable<Iannotation[]> {
    const url = "/api/annotations"
    return this.http.get<Iannotation[]>(url);
  }

}
