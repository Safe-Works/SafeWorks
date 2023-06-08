import { Injectable, EventEmitter} from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openModalSubject: Subject<void> = new Subject<void>();

  openModal(): void {
    this.openModalSubject.next();
  }

  get openModalObservable(): Observable<void> {
    return this.openModalSubject.asObservable();
  }

}