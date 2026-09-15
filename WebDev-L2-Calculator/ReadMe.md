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


 code).authentication bcrypt tutorial" for the full-stack approach. Reference the MDN article on "HTTP cookies and sessions" for understanding session management concepts.
