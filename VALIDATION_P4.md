# Validation notes: P4 (signals autocomplete)

## What I did
- **Setup:** `TP2` folder is in `signal` (`src/app/tp2/`), the project builds.
- **Autocomplete with signals:** a search box that filters CVs by name or first name as you type, with results in a dropdown. Clicking one selects it and grays it out in both lists.

## The flow
```
query (signal)  →  debounced(300 ms)  →  rxResource (HTTP)  →  dropdown
```
Click on a result → `app-item` calls `CvService.selectCv` → the right-hand card, the main list and the dropdown all read that same stream.

## Key pieces
- **`query = signal("")`:** the raw typed text.
- **`debounced(query, 300)`:** waits for 300 ms without typing. Experimental in Angular 22, returns a Resource, so I read `.value()`.
- **`rxResource`:** reloads when `params` changes.
  - `params: ... .trim() || undefined`: `undefined` means idle, so empty input makes **no HTTP call**.
  - A new `params` cancels the previous request (same job as `switchMap`).
  - Gives `value()`, `isLoading()`, `error()` for the template.
- **`selectedCv = toSignal(cvService.selectCv$)`:** shared selection, so all lists stay in sync.
- **`isOpen` signal:** controls the dropdown visibility. Set when typing, cleared on pick.
- **`selectByName`:** builds `{where: {or: [{name: like}, {firstname: like}]}}`, `JSON.stringify`, then `HttpParams`. `or` is an array of alternatives. `HttpParams` URL-encodes the filter, since characters like `%` and `"` can't go raw in a URL.
- **`app-item`:** new `disabled` input. The click returns early when disabled, and a CSS class grays it out. It already calls the service itself, so the autocomplete must not call it again.

## Likely questions
- **Why does the signal version still need RxJS-like debouncing?** Signals only hold a current value and have no time dimension. Debouncing is a time problem. `debounced()` hides the crossing. Without it: `toObservable` → `debounceTime` → `toSignal`.
- **What prevents server spam?** Debounce (one request per pause), `undefined` on empty input (no request), and cancellation of outdated requests. The selected CV is reused, not re-fetched.
- **`resource` vs `rxResource`?** `rxResource`'s loader returns an Observable, which is what `HttpClient` returns.
- **Why `HttpParams`?** Encoding, not page reloads (`http.get` is AJAX).
- **Why a shared `selectCv$` stream, not a local signal?** Selection can happen in the list or the dropdown, and the card must stay in sync.

## Limitations to admit
- `debounced` is experimental.
- `selectCv$` is a plain `Subject`: selection is forgotten after leaving the page.
- The dropdown doesn't close on an outside click.
- I couldn't reproduce slowness or lost clicks locally (API answered in ~0.5 s).
