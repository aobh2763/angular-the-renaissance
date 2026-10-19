# Angular TP1 "La renaissance": Team Task Division

Team of 5. Goal: split the work fairly so everyone can start right away and work in parallel.

---

## 1. At a glance

| Person | Main responsibility                                         | Slides  | Branch      | Effort |
| ------ | ----------------------------------------------------------- | ------- | ----------- | ------ |
| **P1** | Migration to Angular 22 + schematics, repo and branch setup | 3–7     | `migration` | ~4     |
| **P2** | Todo app (signals) + TTC calculator                         | 10–11   | `signal`    | ~4     |
| **P3** | CV components with RxJS + rainbow directive (RxJS version)  | 14, 8–9 | `rxjs`      | ~4     |
| **P4** | cvTech with signals (incl. architecture design)             | 12      | `signal`    | ~4     |
| **P5** | Auth with signals + rainbow directive (signal version)      | 13, 8–9 | `signal`    | ~4     |

> Effort is a rough estimate. We haven't seen the repo yet, so cvTech and auth may turn out bigger than expected. Rebalance after the first look.

---

## 2. Branch structure

```
initial project ──► rxjs        (P3: RxJS exercises)
      │
      └─► migration ──► signal  (P2, P4, P5: signal exercises)
```

- `migration`: initial project upgraded to v22, then the 3 schematics.
- `rxjs`: created from the **initial** project (not from `migration`).
- `signal`: created from `migration`.
- Each person works on a feature branch (e.g. `feat/todo`, `feat/auth`) and merges via pull request. Another member reviews every PR.

### Dependencies: who waits for whom

```
P1 migration ──► signal branch ──► P2, P4, P5 (in parallel)

rxjs branch (from the initial project) ──► P3 (starts now)
```

| Person | Waits for P1?                                  | What they can do meanwhile                                       |
| ------ | ---------------------------------------------- | ---------------------------------------------------------------- |
| **P1** | No                                             | Starts first: upgrades, then schematics                          |
| **P3** | **No**, `rxjs` is based on the initial project | Works fully from day 1                                           |
| **P2** | Yes, for the `signal` branch                   | Builds Todo and TTC as new files now, then rebases on `signal`   |
| **P4** | Yes                                            | Reads the `Cv` code and designs the signal architecture          |
| **P5** | Yes                                            | Reads `auth`, navbar and details component and designs the state |

- P2, P4 and P5 don't depend on each other. They touch different files (new files, `Cv` folder, `auth` and navbar).
- The only overlap is shared files (routes, navbar, details component). Merge `signal` PRs one at a time and rebase before merging.

---

## 3. Tasks in detail

### P1: Migration and repo setup (slides 3–7)

- [ ] Clone `gl4AngularRenaissanceTPStarting` (Angular 18)
- [ ] Create the branch `migration`
- [ ] Upgrade one major version at a time, committing after each and checking `ng serve` works:
  - `ng update @angular/core@19 @angular/cli@19`
  - then 20, 21, 22 the same way
- [ ] Run the schematics **in this order**, checking the app builds and runs between each:
  1. `ng g @angular/core:standalone` (3 runs):
     - "Convert all components, directives and pipes to standalone"
     - "Remove unnecessary NgModule classes"
     - "Bootstrap the project using standalone APIs"
  2. `ng g @angular/core:control-flow` (`@if` / `@for` instead of `*ngIf` / `*ngFor`)
  3. `ng generate @angular/core:inject` (constructor injection becomes `inject()`)
- [ ] Create `rxjs` (from the initial project) and `signal` (from `migration`) and tell the team
- [ ] Handle merges

> Newer Angular versions already default to standalone, so some schematic steps may find little to change. That's fine.

---

### P2: Todo app and TTC calculator (slides 10–11, `signal` branch)

**Todo app**

- [ ] `Todo` model: `id`, `name`, `content`, `status`
- [ ] `export type TodoStatus = 'waiting' | 'in progress' | 'done';`
- [ ] `TodoService` with a `signal<Todo[]>` and three `computed` lists (one per status)
- [ ] Component with a form (name, content, add button) and 3 columns: Waiting, In Progress, Done
- [ ] Changing a todo's status updates the signal, and the todo moves columns automatically

**TTC calculator**

- [ ] Signals for: price excl. tax (default **0**), quantity (default **1**), VAT % (default **18**)
- [ ] `computed` values: unit price incl. tax, discount, total price
- [ ] Discount rules:

| Quantity               | Discount |
| ---------------------- | -------- |
| 10 or less             | 0%       |
| more than 10, up to 15 | 20%      |
| more than 15           | 30%      |

> The slide says "between 10 and 15", but its screenshot shows quantity 10 with a $0 discount. We assume the table above. **Confirm with the instructor.**

---

### P3: RxJS branch (slides 14 and 8–9, `rxjs`)

**CV components**

- [ ] Rework `CvComponent` and `DetailsCvComponent`
- [ ] Keep data as `Observable`s and use the **`async` pipe** wherever possible (no manual `subscribe` / `unsubscribe`)
- [ ] Handle errors with **`catchError`** (return a fallback like `of([])` and expose an error message to the template)

**Rainbow directive (RxJS version)**

- [ ] See the spec in section 4

---

### P4: cvTech with signals (slide 12, `signal` branch)

- [ ] Rework the `Cv` folder using signals where they make sense (CV list, selected CV, filter or search state)
- [ ] Design the architecture first: a service owns the state as signals, and components read from it and derive values with `computed`
- [ ] Use `effect` sparingly, and not for state you could simply derive
- [ ] Prepare a justification for every choice (why a signal here, why an observable there). This is the part most likely to be questioned at validation.

---

### P5: Auth with signals and rainbow directive (slides 13 and 8–9, `signal` branch)

**Authentication**

- [ ] Read the `auth` folder, the navbar and the details component first
- [ ] `AuthService` keeps the user (`id`, `email`) in a signal, plus an `isAuthenticated` `computed`
- [ ] Persist the user (e.g. localStorage) and **restore it when the app loads**
- [ ] Navbar and details component read the signals directly
- [ ] **No state management library** (no NgRx)

**Rainbow directive (signal version)**

- [ ] Same behavior as P3's version, but state held in signals so the difference between the branches is visible

---

## 4. Rainbow directive: shared spec (P3 and P5, slides 8–9)

Agree on this together so both versions behave the same.

- Selector limited to inputs: `input[appRainbow]`. It must **not** apply to a `div`.
- Host bindings on `color` and `border-color`.
- A method that generates a random hex color (`#` + 6 random hex digits).
- A `keyup` listener that picks a new random color on every keystroke.
- **P3:** classic `@HostBinding` with plain properties.
- **P5:** signal-based state bound to the host styles.

---

## 5. Suggested timeline

1. **Day 1:** P1 starts the migration and creates the branches as early as possible. P3 starts immediately (the `rxjs` branch doesn't depend on the migration). P2 builds Todo and TTC as new files, so no conflicts with the schematics.
2. **While waiting for P1:** P4 and P5 read the existing code and design their architecture (where signals live, which services hold state). They don't edit existing files yet, because the schematics rewrite them.
3. **After migration:** everyone branches off `signal` (or `rxjs`) and works in parallel.
4. **Before validation:** final integration, then cross-explanation sessions.

---

## 6. Rules from the instructor (slide 2, read them)

- If you read your code aloud instead of explaining it, you get a **0**.
- Think before you code or ask an AI.
- Clean architecture, readable and factorised code, and design patterns are **mandatory**.
- Treat validation like a job interview. Everyone must understand **all** parts, not only their own.

**Our plan:** before validation, each person spends ~30 minutes walking the others through their part, then we quiz each other.

---

## 7. Shared conventions (agree on day 1)

- Folder structure and file naming
- Code style (formatting, linting)
- Commit message format
- PR rule: at least one reviewer before merging