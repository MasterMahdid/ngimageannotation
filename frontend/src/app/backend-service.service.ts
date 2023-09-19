import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, async, asyncScheduler } from 'rxjs';
import { ajax } from 'rxjs/ajax';
export interface Iannotation {
  id: string
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

  private annotationsSubject: BehaviorSubject<Iannotation[]> = new BehaviorSubject<Iannotation[]>([]);
  annotatations$: Observable<Iannotation[]> = this.annotationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateAnnotations();
  }
  private updateAnnotations(): void {
    const ob = this.http.get<Iannotation[]>('/api/annotations');
    ob.subscribe(res => {
      this.annotationsSubject.next(<Iannotation[]>res);
    });
  }
  deleteAnnotation(id: string): void {
    const ob = this.http.delete<any>('/api/annotations/' + id);
    ob.subscribe(res => {
      this.updateAnnotations();
    });
  }
  editAnnotaion(id: string, fields: object): void {
    var headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    const ob = this.http.put<any>('/api/annotations/'+id,JSON.stringify(fields), {
      headers: headers
    })
    ob.subscribe(res => {
      this.updateAnnotations();
    });
  }
  newAnnotation(fields: object): void {
    var headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    const ob = this.http.post<any>('/api/annotations/',JSON.stringify(fields), {
      headers: headers
    })
    ob.subscribe(res => {
      this.updateAnnotations();
    });
  }
}
