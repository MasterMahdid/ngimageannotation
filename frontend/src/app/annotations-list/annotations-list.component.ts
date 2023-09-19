import { Component } from '@angular/core';
import { BackendServiceService, Iannotation } from '../backend-service.service';
import { Observable } from 'rxjs';
import {Modal} from 'bootstrap';
@Component({
  selector: 'app-annotations-list',
  templateUrl: './annotations-list.component.html',
  styleUrls: ['./annotations-list.component.css']
})
export class AnnotationsListComponent {
  data$: Observable<Iannotation[]>;

  constructor(private service: BackendServiceService) {
    this.data$ = service.annotatations$;
  }
  deleteAnnotation(id: string) {
    this.service.deleteAnnotation(id);
    //const dom = document.getElementById('mymodal');
    //var myModal = new Modal(<Element>dom, {});
    //myModal.show()
  }
  ngOnInit(): void {
  }
}
