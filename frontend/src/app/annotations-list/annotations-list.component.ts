import { Component } from '@angular/core';
import { BackendServiceService, Iannotation } from '../backend-service.service';

@Component({
  selector: 'app-annotations-list',
  templateUrl: './annotations-list.component.html',
  styleUrls: ['./annotations-list.component.css']
})
export class AnnotationsListComponent {
  data?: Iannotation[]
  constructor(private service: BackendServiceService) { }
  ngOnInit(): void {
    this.service.getAnnotations().subscribe({
      next: (data) => {
        this.data = data;
        //console.log(data);
      }
    });
  }
}
