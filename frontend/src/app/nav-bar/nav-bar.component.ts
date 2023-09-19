import { Component, Input } from '@angular/core';
import { BackendServiceService, Iannotation } from '../backend-service.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input()
  title?: string;
  constructor(private service: BackendServiceService) { }

  newAnnotation(): void {
    const modal: Iannotation = {
      dnn_model: '',
      confidence: 0,
      object: 'awda',
      object_version: 've',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      id: ''
    };
    this.service.newAnnotation(modal);
  }
}
