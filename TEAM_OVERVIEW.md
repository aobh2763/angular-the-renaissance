# TP2: what each person does (brief)

All five get 8 points. Merge via PR, one at a time, with a reviewer. Everyone must understand **all** parts at validation.

## P1: Loopback search + Products "load more" (`rxjs`)
- **Loopback search:** a `CvService` method that searches CVs by name through the `filter` query parameter, plus a shared autocomplete spec for P2 and P4. Done first because P2 and P4 wait on it.
- **Products "load more":** `dummyjson.com/products` with `limit` and `skip`. Start with 12, and the button **adds** the next batch. Stop calling the API when the loaded count reaches `total`. Must be declarative: a Subject for clicks, `scan` to accumulate, `exhaustMap` for the request, `async` pipe, no manual `subscribe`.

## P2: CV autocomplete (RxJS) + CurrencySelector
- **Autocomplete (`rxjs`):** live filtering by name. Minimize HTTP calls with `debounceTime`, `distinctUntilChanged`, skipping empty input and `switchMap`. Put `catchError` inside the `switchMap`. Everything is a stream with the `async` pipe.
- **CurrencySelector (`signal`):** two selects, country then currency. When the country changes, keep the currency if the new country accepts it, otherwise take the first one. Uses `linkedSignal` plus `computed`.

## P3: Master-Detail + `@defer` (`signal`)
- **Master-Detail:** the CV list on the left, the clicked CV's details on the same page, using **child routes** (`/cv/list` and `/cv/list/:id`) with a `<router-outlet>`. The details component must react to id changes (`paramMap`, not a one-time snapshot).
- **`@defer` for `embauche`:** defer loading and display, choose and justify triggers, add prefetching, and `@placeholder`, `@loading` and `@error` blocks. Needs standalone components.

## P4 (me): Setup + CV autocomplete (signals) (`signal`)
- **Setup:** bring the instructor's `TP2` folder into `signal`, make it build, push, and tell P2 and P5.
- **Autocomplete (signals):** same behavior as P2's, following the shared spec. Uses a `signal` for the text, `debounced`/`toObservable` for debouncing, `rxResource` for loading and a signal for the selection. No server spam.

## P5: Lazy loading + ProductFilter (`signal`)
- **Lazy loading:** load always-needed pages (home, auth) eagerly and feature areas (CV, todo, products) lazily. Choose a **preloading strategy** and argue it (none, all, or custom), and consider `canMatch` guards.
- **ProductFilter:** a text input, a category select and a product list. Changing the category must keep the text filter. Uses `signal` for text and category and `computed` for the filtered list. Reset button assumed to clear both.

## Dependencies
- P1's Loopback method and spec come first, for P2 and P4.
- P4's setup comes first, for P2's Currency and P5's ProductFilter.
- P1 Products, P3 and P5 Lazy loading are independent from the start.

## Instructor rules
- Reading your code aloud instead of explaining it gives a **0**.
- Think before you code or ask an AI.
- Clean, readable, factorised code is mandatory.
- Treat validation like a job interview. Everyone explains all parts.
