import { Injectable } from '@angular/core';
import { fromEvent, debounceTime, map, Observable, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WindowResolutionObserverService {
  constructor() {}

  matchesMobileBreakpoint(): Observable<boolean> {
    return fromEvent(window, 'resize').pipe(
      debounceTime(250),
      map(() => window.innerWidth < 1280),
      startWith(window.innerWidth < 1280),
    );
  }
}
