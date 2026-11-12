# Angular TP2: Team Task Division

Team of 5 (same as TP1). Goal: **equal effort for everyone**, with no one blocked for long, so all five can work in parallel.

> Assumes the TP1 branches `rxjs` and `signal` already exist. If not, create them first (see the TP1 document).

---

## 1. At a glance

Every person gets **8 points** (1 point is roughly half an hour of focused work, so treat the scores as relative estimates).

| Person | Task 1                                       | Task 2                    | Slides   | Branch                | Points        |
| ------ | -------------------------------------------- | ------------------------- | -------- | --------------------- | ------------- |
| **P1** | Loopback search + shared spec (do first)     | Products "load more"      | 3–4, 7   | `rxjs`                | 2 + 6 = **8** |
| **P2** | CV autocomplete (RxJS)                       | CurrencySelector          | 7, 5     | `rxjs`, then `signal` | 5 + 3 = **8** |
| **P3** | Master-Detail for CVs                        | `@defer` for `embauche`   | 9–12, 13 | `signal`              | 5 + 3 = **8** |
| **P4** | Setup: `TP2` folder into `signal` (do first) | CV autocomplete (signals) | 5, 8     | `signal`              | 2 + 6 = **8** |
| **P5** | Lazy loading strategy                        | ProductFilter             | 13, 6    | `signal`              | 5 + 3 = **8** |

### How the points were scored

| Task                        | Pts    | Why                                                                                                 |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| Products "load more"        | 6      | Declarative RxJS (accumulate, avoid double loads, stop condition) is the trickiest RxJS part of TP2 |
| Autocomplete (signals)      | 6      | Same as the RxJS version, plus finding the signal answer to debouncing                              |
| Autocomplete (RxJS)         | 5      | Familiar operator chain, but several HTTP optimizations are required                                |
| Master-Detail               | 5      | Child routes, outlet, navigation, reusing the details component                                     |
| Lazy loading strategy       | 5      | Open-ended: argued choices per route plus a preloading strategy                                     |
| CurrencySelector            | 3      | One tricky rule, solved by `linkedSignal`                                                           |
| ProductFilter               | 3      | Two input signals and a `computed` list                                                             |
| `@defer`                    | 3      | One template block, but triggers and prefetch must be justified                                     |
| Loopback search + spec      | 2      | Swagger test, one service method, a shared spec for both autocompletes                              |
| Setup (`TP2` into `signal`) | 2      | Bring the folder over, make it build, fix imports                                                   |
| **Total**                   | **40** | **5 × 8**                                                                                           |

If you disagree with a score, move a task between people and keep each total at 8.

---

## 2. Branches and dependencies

```
P1 Loopback + spec (first hour) ──► P2 Autocomplete RxJS, P4 Autocomplete signals
P4 Setup (TP2 → signal)         ──► P2 Currency, P5 ProductFilter

Independent from the start: P1 Products · P3 Master-Detail + @defer · P5 Lazy loading
```

Each person's order of work:

| Person | Start with                                                                     | Then                                                         |
| ------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **P1** | Loopback + spec (about an hour, everyone is waiting on it)                     | Products                                                     |
| **P2** | Autocomplete skeleton (streams, template) while waiting for P1's Loopback call | Finish autocomplete, then Currency once P4's setup is pushed |
| **P3** | Master-Detail                                                                  | `@defer` (no dependency on anyone)                           |
| **P4** | Setup (about an hour, others wait on it)                                       | Autocomplete (signals)                                       |
| **P5** | Lazy loading (no dependency on anyone)                                         | ProductFilter once P4's setup is pushed                      |

Other things to coordinate:

- **Both small blockers (P1's Loopback and P4's setup) are first on their owners' lists** and take about an hour. Push as soon as they work.
- **Master-Detail needs a details component that reacts to route changes.** Use a version that reads the id from `paramMap` (or a signal-based equivalent), not a one-time snapshot. With a snapshot, clicking another CV won't update the detail, because Angular reuses the component.
- **P2 and P4 solve the same problem two ways.** Both follow the shared spec (section 4).
- **Merge via PR**, one at a time, with another member reviewing.

---

## 3. Tasks in detail

### P1: Loopback search + shared spec, then Products (slides 7, 3–4, `rxjs`)

**Loopback search and shared spec (first, ~2 pts)**
- [ ] Test the Loopback filter on Swagger. It goes in the `filter` query parameter, with the syntax from slide 7 (`where` → `name` → `like` → `%text%`).
- [ ] Add a `CvService` method that searches CVs by name (let Angular's `HttpParams` do the encoding; don't build the URL by hand with a raw `%`)
- [ ] Post the working call to the team so P2 and P4 can use it (P4 re-adds the same method on `signal`)
- [ ] Write the shared autocomplete spec (section 4) and agree on it with P2 and P4

**Products "load more" (slides 3–4, 6 pts)**
- [ ] The component already exists in the `product` folder. Finish what's missing.
- [ ] API: `https://dummyjson.com/products` (docs: `/docs/products`). It supports `limit` and `skip` and returns the products plus a `total`.
- [ ] Start with **12** products
- [ ] The "more products" button loads the next batch and **adds** it to what's already shown
- [ ] When nothing remains (loaded count reaches `total`, or an empty page), **stop calling the API** and hide or disable the button
- [ ] **Declarative code** (slide 3 insists): no manual `subscribe`, no pushing into an array
  - A Subject for button clicks, `scan` to accumulate the offset and the list, `exhaustMap` (or `concatMap`) for the request, `async` pipe in the template
  - `exhaustMap` ignores clicks while a request is running, which prevents double loading

---

### P2: CV autocomplete (RxJS), then CurrencySelector (slides 7, 5)

**Autocomplete with RxJS (slide 7, `rxjs`, 5 pts)**
- [ ] Reuse the existing autocomplete component and P1's Loopback method
- [ ] Typing changes the choices live, showing only CVs whose name contains the typed text
- [ ] Selecting a choice shows the matching CV
- [ ] **Minimize HTTP calls** (the slide says don't spam the server):
  - `debounceTime` to wait for the user to pause
  - `distinctUntilChanged` to skip identical queries
  - skip empty input
  - `switchMap` to cancel the outdated request
  - reuse the CV object already returned instead of fetching it again
- [ ] Put `catchError` inside the `switchMap`
- [ ] "Most reactive code possible": everything is a stream, `async` pipe in the template, no manual subscriptions

**CurrencySelector (slide 5, `signal`, 3 pts, after P4's setup)**
- [ ] The component and `countries` data are in the `TP2` folder
- [ ] Two selects: country, then currency
- [ ] Choosing a country fills the second select with that country's accepted currencies
- [ ] Rule for the selected currency when the country changes:
  - keep the previous currency **if the new country accepts it**
  - otherwise select the **first** currency of the new country
- [ ] Use signal APIs. `linkedSignal` is the natural fit: a writable value that resets from a source (the currency list) but can still be set by the user. Pair it with a `computed` for the list of currencies.

> Heads-up: the slide's example says "TND", but the data uses `DIN` for Tunisia. Don't hunt for a bug, the example is just inconsistent. Also, pasting the data from the PDF gives curly quotes (`’`), which break TypeScript. Retype them.

---

### P3: Master-Detail, then `@defer` (slides 9–12, 13, `signal`)

Both tasks live in the Cv area, so one person avoids merge conflicts there. No dependency on teammates.

**Master-Detail (slides 9–12, 5 pts)**
- [ ] Create the `MasterDetailsCv` component
- [ ] **Master**: shows the CV list. **Detail**: shows the CV that was clicked, on the same page, with no full page reload.
- [ ] Implement it with **child routes**: a parent route for the list (`/cv/list` in the screenshot) and a child route with the id (`/cv/list/:id`)
- [ ] The master template contains a `<router-outlet>` where the detail appears (slide 10 diagram)
- [ ] Clicking a CV navigates to the child route
- [ ] Reuse the details component, making sure it reacts when the id changes (see section 2)
- [ ] The "container works!" and "resolution-modifiers works!" boxes in the screenshot look like unrelated placeholders, not requirements

**`@defer` for the `embauche` component (slide 13, 3 pts)**
- [ ] In the Cv page, defer loading **and** display of the `embauche` component
- [ ] Choose **triggers** and justify them: `on viewport` (if it's below the fold), `on idle`, `on interaction`, `on hover`, `on timer`, or `when <condition>`
- [ ] Add **prefetching** (e.g. `prefetch on idle` or `prefetch on hover`) so the content is ready before it's shown
- [ ] Add `@placeholder` (required for `on viewport`), plus `@loading` and `@error` blocks where useful
- [ ] **Deferred components must be standalone.** That's why `signal` (post-migration) is the suggested branch. On `rxjs` you'd have to make `embauche` standalone first.

---

### P4: Setup, then CV autocomplete (signals) (slides 5, 8, `signal`)

**Setup (first, ~2 pts)**
- [ ] Pull the instructor's new `TP2` folder from the main branch into `signal` (fetch upstream, then check out that folder from main)
- [ ] Make sure it builds (imports, routes), commit and push
- [ ] Tell P2 and P5 it's available

**Autocomplete with signals (slide 8, 6 pts)**
- [ ] Same exercise and behavior as P2's, but with signals (slide 8: "reprenez le même exercice dans la branche signal")
- [ ] Follow the shared spec (section 4) and add P1's Loopback method on `signal`
- [ ] Suggested structure: a `signal` for the typed text, a signal-based way to load the CVs from that text, a `signal` for the selected CV, and a `computed` for what is displayed
- [ ] Signal tools to evaluate: `resource` / `rxResource` (check their status in your Angular 22 version), or `toObservable` + `toSignal`
- [ ] **Debouncing has no direct signal equivalent.** The usual answer is to cross into RxJS at that one spot (`toObservable`, `debounceTime`, then back with `toSignal`). Be ready to explain why this is fine and what it says about signals vs RxJS.
- [ ] Don't spam the server: debounce, skip empty input, and don't re-fetch the selected CV

---

### P5: Lazy loading, then ProductFilter (slides 13, 6, `signal`)

**Lazy loading (slide 13, 5 pts)**
- [ ] Improve route loading with a sensible strategy and **argued choices** (the slide grades the reasoning)
- [ ] Decide per route: always-needed pages (home, auth) load eagerly; feature areas (CV, todo, products...) load lazily
- [ ] Pick a **preloading strategy** and say why. Options to compare:
  - no preloading: smallest initial load, but a delay on first navigation
  - preload everything: simple, but downloads pages nobody may visit
  - custom strategy: preload only the routes users are likely to open next (e.g. flag them in the route data)
- [ ] Consider `canMatch` guards so users who aren't allowed in don't even download the chunk

**ProductFilter (slide 6, 3 pts, after P4's setup)**
- [ ] Finish the `ProductFilter` component in the `TP2` folder
- [ ] It has a text input (filter string), a category select, and a product list (with a Reset button in the screenshot)
- [ ] **Changing category must keep the list filtered by the text field**: the list depends on both the text and the category
- [ ] Use signals: `signal` for the text and category, `computed` for the filtered list
- [ ] The screenshot title mentions `LinkedSignal`. Use it only where it genuinely fits, and be ready to justify the choice.

---

## 4. Autocomplete: shared spec (P1 writes it, P2 and P4 follow it)

So both versions behave the same and can be compared:

- Same Loopback call and filter format (tested on Swagger first)
- Same debounce delay (e.g. 300 ms) and same handling of empty input
- Same behavior when nothing matches (empty list, no error)
- Same behavior on selection: the CV shows below the list
- Same error handling (message or fallback)

---

## 5. Suggested timeline

1. **Hour 1:** P1 finishes Loopback + spec, P4 finishes the setup, both push. P2 builds the autocomplete skeleton, P3 starts Master-Detail, P5 starts lazy loading.
2. **After the setup is pushed:** P2 can start Currency whenever the autocomplete is done, and P5 can start ProductFilter whenever lazy loading is done.
3. **Mid-way:** P2 and P4 compare their autocomplete versions against the shared spec.
4. **Before validation:** merge PRs one at a time, then the cross-explanation sessions.

---

## 6. Rules from the instructor (slide 2, read them)

- If you read your code aloud instead of explaining it, you get a **0**.
- Think before you code or ask an AI.
- Clean architecture, readable and factorised code, and design patterns are **mandatory**.
- Treat validation like a job interview. Everyone must understand **all** parts, not only their own.

**Our plan:** before validation, each person spends ~30 minutes walking the others through their part, then we quiz each other.

---

## 7. Open questions to confirm with the instructor

- **Which branch for Master-Detail and Lazy loading / `@defer`?** The slides don't say. Suggested: `signal` for both, because `@defer` needs standalone components and keeping P3's work on one branch avoids conflicts.
- **TND vs DIN** in the currency example (see P2).
- **Should the ProductFilter Reset button clear both the text and the category?** The slide doesn't say, so we assume yes.

---

## 8. Questions to prepare for validation

- **Products:** why `exhaustMap` (or `concatMap`) instead of `switchMap` for "load more"? What stops the API calls?
- **Autocomplete:** what do `debounceTime`, `distinctUntilChanged` and `switchMap` each prevent? Why does the signal version still need RxJS for debouncing?
- **Currency:** what does `linkedSignal` do that `computed` can't?
- **ProductFilter:** why is the filtered list a `computed` and not stored state?
- **Master-Detail:** why child routes, and why must the details component react to id changes instead of reading a snapshot?
- **Lazy loading:** why this preloading strategy? Why does `@defer` need standalone components, and why those triggers?