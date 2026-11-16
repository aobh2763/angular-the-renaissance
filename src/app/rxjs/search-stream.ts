import {
  Observable, catchError, debounceTime, distinctUntilChanged,
  map, of, shareReplay, switchMap,
} from "rxjs";
import { SEARCH_DEBOUNCE_MS } from "../../config/search.config";

export function searchStream<T>(
  term$: Observable<string>,
  search: (term: string) => Observable<T[]>,
  fallback: () => T[] = () => [],
): Observable<T[]> {
  return term$.pipe(
    map((term) => term.trim()),
    debounceTime(SEARCH_DEBOUNCE_MS),
    distinctUntilChanged(),
    switchMap((term) =>
      search(term).pipe(catchError(() => of(fallback()))),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
