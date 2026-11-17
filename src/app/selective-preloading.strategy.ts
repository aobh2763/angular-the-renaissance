import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Preloads ONLY the lazy routes flagged with `data: { preload: true }`
 * (the pages users are likely to open next), once the app has booted.
 * Skipped when the user enabled "data saver" on their device.
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const saveData = (navigator as any).connection?.saveData === true;
    return route.data?.['preload'] && !saveData ? load() : of(null);
  }
}
