/*
 A simple calculator implemented in vanilla JavaScript. Every operation below is built from plain variables, conditionals, and a switch statement rather than parsing/evaluating a string expression. This avoids eval() entirely, which MDN explicitly warns against because it runs arbitrary code with the privileges of the caller and ia common vector for injection attacks:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval

Key references used while writing this file:
- EventTarget.addEventListener():
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- switch statement:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
- parseFloat():
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
 */
(function () {
  'use strict';

  const historyEl = document.getElementById('history');
  const resultEl = document.getElementById('result');
  const pad = document.getElementById('pad');

  // State machine for the calculator
  let currentInput = '0';    // what's currently being typed / shown
  let previousValue = null;  // stored operand
  let pendingOp = null;      // '+', '−', '×', '÷'
  let justEvaluated = false; // true right after '=' was pressed
  let isError = false;

  /*
   * Safely converts the on-screen string to a number.
   *
   * parseFloat() parses a string and returns a floating point number, or
   * NaN if the first non-whitespace character can't be converted
   * (MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat).
   * Since every string this calculator produces is built one validated
   * digit/operator at a time, parseFloat() should never actually hit NaN
   * here — but we guard for it anyway so a bad state can't silently
   * poison later arithmetic.
   */
  function toNumber(str) {
    const parsed = parseFloat(str);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function formatNumber(num) {
    if (!isFinite(num)) return 'Error';
    // Avoid absurdly long floating point tails
    const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
    let str = rounded.toString();
    if (str.length > 14) {
      str = rounded.toPrecision(10).replace(/\.?0+$/, '').replace(/\.?0+e/, 'e');
    }
    return str;
  }

  function render() {
    resultEl.classList.toggle('error', isError);
    resultEl.textContent = isError ? 'Cannot divide by zero' : currentInput;

    if (isError) {
      historyEl.textContent = '\u00a0';
      return;
    }

    if (previousValue !== null && pendingOp) {
      historyEl.textContent = `${formatNumber(previousValue)} ${pendingOp}`;
    } else {
      historyEl.textContent = '\u00a0';
    }
  }

  function resetAll() {
    currentInput = '0';
    previousValue = null;
    pendingOp = null;
    justEvaluated = false;
    isError = false;
  }

  function inputDigit(digit) {
    if (isError) resetAll();

    if (justEvaluated) {
      // Starting a fresh number after an equals result
      currentInput = digit === '.' ? '0.' : digit;
      justEvaluated = false;
      return;
    }

    if (digit === '.') {
      if (currentInput.includes('.')) return; // only one decimal point
      currentInput += '.';
      return;
    }

    if (currentInput === '0') {
      currentInput = digit;
    } else {
      currentInput += digit;
    }
  }

  function chooseOperator(op) {
    if (isError) return;

    if (pendingOp && !justEvaluated) {
      // Chain: resolve the previous operation first, then continue
      // (e.g. 5 + 3 × 2 evaluates "5 + 3" before applying ×).
      evaluate();
      if (isError) return;
    }

    previousValue = toNumber(currentInput);
    pendingOp = op;
    justEvaluated = false;
    currentInput = '0';
  }

  /*
   * Performs the pending arithmetic operation.
   *
   * Uses a switch statement to dispatch on the operator symbol, matching
   * the pattern MDN documents — each case ends in break so control falls
   * out of the switch instead of through to the next case, and default
   * covers any unrecognized operator defensively:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
   */
  function evaluate() {
    if (pendingOp === null || previousValue === null) return;

    const a = previousValue;
    const b = toNumber(currentInput);

    if (pendingOp === '÷' && b === 0) {
      isError = true;
      currentInput = '0';
      previousValue = null;
      pendingOp = null;
      justEvaluated = false;
      return;
    }

    let outcome;
    switch (pendingOp) {
      case '+':
        outcome = a + b;
        break;
      case '−':
        outcome = a - b;
        break;
      case '×':
        outcome = a * b;
        break;
      case '÷':
        outcome = a / b;
        break;
      default:
        // Unknown operator — bail out without touching state.
        return;
    }

    currentInput = formatNumber(outcome);
    previousValue = outcome;
    pendingOp = null;
    justEvaluated = true;
  }

  function backspace() {
    if (isError) { resetAll(); return; }
    if (justEvaluated) { currentInput = '0'; justEvaluated = false; return; }

    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }
  }

  function applyPercent() {
    if (isError) return;
    const value = toNumber(currentInput);
    currentInput = formatNumber(value / 100);
  }

  /*
   * A single delegated click listener on the button grid, rather than an
   * inline onclick on every button or a listener per button. addEventListener()
   * is the recommended way to register listeners because it supports
   * multiple handlers per target and works on any EventTarget:
   * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */
  pad.addEventListener('click', function (event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const { num, op, action } = btn.dataset;

    if (num !== undefined) {
      inputDigit(num);
    } else if (op !== undefined) {
      chooseOperator(op);
    } else if (action === 'equals') {
      evaluate();
    } else if (action === 'clear') {
      resetAll();
    } else if (action === 'backspace') {
      backspace();
    } else if (action === 'percent') {
      applyPercent();
    }

    render();
  });

  // Optional keyboard support, wired the same way via addEventListener().
  document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) { inputDigit(key); render(); return; }
    if (key === '.') { inputDigit('.'); render(); return; }
    if (key === '+') { chooseOperator('+'); render(); return; }
    if (key === '-') { chooseOperator('−'); render(); return; }
    if (key === '*') { chooseOperator('×'); render(); return; }
    if (key === '/') { event.preventDefault(); chooseOperator('÷'); render(); return; }
    if (key === 'Enter' || key === '=') { evaluate(); render(); return; }
    if (key === 'Backspace') { backspace(); render(); return; }
    if (key === 'Escape') { resetAll(); render(); return; }
    if (key === '%') { applyPercent(); render(); return; }
  });

  render();
})();
