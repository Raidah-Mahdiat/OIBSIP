# OIBSIP
LEVEL 2

# TASK 1 · Calculator
<img width="1627" height="812" alt="image" src="https://github.com/user-attachments/assets/1d0e8fd1-8db1-4edd-b21b-dcc5c8426f89" />

A browser-based calculator built with plain HTML, CSS, and JavaScript — no frameworks, no libraries, no `eval()`. Built as part of my Oasis Infobyte (OIB-SIP) internship task.

## Why I built it this way

The brief asked for a calculator that handles basic arithmetic, operator chaining, and division-by-zero without crashing — so instead of parsing and evaluating an expression string, I kept the calculator's state (current input, stored operand, pending operator) in plain variables and resolved each operation with a `switch` statement. That was a deliberate choice: `eval()` would have been a shorter way to get the same result, but it executes arbitrary strings as code, which is bad practice and something I wanted to avoid on purpose rather than not know about.

## Features

- Display screen showing both the running expression and the current result
- Digit buttons `0`–`9` and a decimal point
- Operators: addition (`+`), subtraction (`−`), multiplication (`×`), division (`÷`)
- `=` to evaluate the current expression
- `C` to clear and reset
- `⌫` backspace to delete the last entered character
- Division-by-zero protection — shows an on-screen error instead of crashing or displaying `Infinity`
- Operator chaining — e.g. `5 + 3 × 2` resolves `5 + 3` before applying `× 2`, no reset required
- Keyboard support (digits, `+ - * /`, `Enter`, `Backspace`, `Escape`, `%`)

## Tech stack

- **HTML5** — semantic structure, no inline `onclick` attributes
- **CSS3** — layout built with CSS Grid
- **JavaScript (Vanilla)** — no external libraries; all event binding done with `addEventListener()`, all arithmetic done with real operators via a `switch` statement (no `eval()`)

## Project structure

```
calculator/
├── index.html   # markup
├── style.css    # layout, theme, responsive rules
├── script.js    # calculator logic and event handling
└── README.md
```

## Getting started

No build step or dependencies required.

1. Clone or download this repository
2. Open `index.html` in any modern browser

```bash
git clone <your-repo-url>
cd calculator
open index.html   # or double-click the file
```

Because the three files use relative links (`<link href="style.css">`, `<script src="script.js">`), keep them together in the same folder.

## How it works

- **State, not string-eval**: the current input, the stored operand, and the pending operator are tracked in plain variables. Pressing `=` runs a `switch` statement against the pending operator and computes the result with real arithmetic operators.
- **Chaining**: pressing an operator while another is already pending evaluates the pending operation first, then starts the next one, so multi-step input like `5 + 3 × 2` behaves as expected without pressing `=` in between.
- **Division by zero**: caught explicitly before the divide happens; the display switches to an error state that clears on the next key press instead of the app crashing or showing `Infinity`.
- **Events**: a single delegated `click` listener on the button grid (via `addEventListener()`) reads each button's `data-*` attributes to decide what action to take, rather than attaching a listener per button or using inline `onclick` in the HTML.

## What I'd add next

- A history log of past calculations
- Support for parentheses and operator precedence beyond simple left-to-right chaining
- Unit tests for the arithmetic and edge cases (division by zero, repeated decimals, long chains)

## References

I used these MDN pages as my primary reference while writing the JavaScript:

- [`EventTarget.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [`switch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)
- [`parseFloat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)
- [Why you shouldn't use `eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval)

## License

MIT — free to use, modify, and distribute.

TASK 2 · Tribute Page
Objective: Design and build a visually engaging tribute page dedicated to a historical figure, scientist, artist, or public figure you admire.
Tech Stack: HTML5, CSS3 (JavaScript optional)
Feature Checklist:
[ ] Page title with the subject's name and a one-line tagline
[ ] A prominent image (use a royalty-free image — source from Unsplash or Wikimedia Commons)
[ ] A biography or tribute section: at least 3–4 paragraphs of original written content
[ ] A timeline or key achievements section (ordered list or styled cards)
[ ] A quote block: a notable quote from or about the subject, styled distinctly
[ ] At least 2 different background colours used across sections
[ ] At least 2 font styles explored (e.g., serif for headings, sans-serif for body)
[ ] Responsive layout
Self-Sourcing Guideline: Use Wikipedia or Britannica to research your subject for factual content (paraphrase — do not copy). Source images from Unsplash.com (search by person's name or era) or Wikimedia Commons for public domain images. Search "HTML CSS tribute page freeCodeCamp" for structural guidance.

TASK 3 · To-Do Web App
Objective: Develop an interactive to-do list application that allows users to manage daily tasks with add, complete, edit, and delete functionality, organised into pending and completed lists.
Tech Stack: HTML5, CSS3, JavaScript (Vanilla or with a small library like Alpine.js)
Feature Checklist:
[ ] Input field + "Add Task" button to create new tasks
[ ] Newly added tasks appear immediately in the Pending Tasks list
[ ] Each task has a "Mark Complete" toggle — completed tasks move to the Completed Tasks list
[ ] Each task has an Edit button that allows the task text to be modified inline
[ ] Each task has a Delete button that permanently removes it from either list
[ ] Task count indicators: "X pending" and "Y completed" displayed above each list
[ ] (Bonus) Timestamp displayed on each task showing when it was added and/or completed
[ ] (Bonus) Tasks persist across page refreshes using localStorage
[ ] Empty state messaging: display a friendly message when a list has no items
Self-Sourcing Guideline: Search "JavaScript to-do list app tutorial DOM manipulation" to understand the core pattern. For localStorage persistence, search "localStorage JavaScript beginners guide MDN". Look at GitHub repositories with the topic "todo-app vanilla-js" for architecture inspiration (read — don't copy code).

TASK 4 · Login Authentication System
Objective: Build a simple client-side (or full-stack) authentication system featuring user registration, login validation, and access to a protected page.
Tech Stack: Choose one approach — (A) Front-end only: HTML/CSS/JavaScript with localStorage, (B) Full-stack: Node.js + Express + a simple JSON or SQLite store, or (C) Python Flask with session management.
Feature Checklist:
[ ] Registration page: fields for username/email and password, with a "Register" button
[ ] Password validation on registration: minimum 8 characters, at least 1 number
[ ] Duplicate username/email check — display an error if the user already exists
[ ] Login page: fields for username/email and password, with a "Login" button
[ ] Incorrect credential handling: display a clear error message (do not reveal which field is wrong)
[ ] Protected/Dashboard page: only accessible after successful login; redirect to login page if accessed directly without a session
[ ] Logout button on the dashboard that clears the session/localStorage and redirects to login
[ ] Passwords must not be stored in plain text — use a basic hashing approach (e.g., bcrypt for Node/Python, or a SHA-256 approach for client-side)
[ ] Basic form validation on both pages (no empty submissions)
Self-Sourcing Guideline: Search "login authentication system JavaScript localStorage tutorial" for the front-end approach, or "Node.js Express login authentication bcrypt tutorial" for the full-stack approach. Reference the MDN article on "HTTP cookies and sessions" for understanding session management concepts.
