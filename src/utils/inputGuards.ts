/** Blocks keys that make no sense in a money field: e/E (scientific notation), +, -. */
export function blockInvalidNumberKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
}

/** Blocks typing a 3rd digit after the decimal point (but still allows selecting/replacing text). */
export function blockExcessDecimals(e: React.KeyboardEvent<HTMLInputElement>) {
  if (!/^[0-9]$/.test(e.key)) return;

  const input = e.currentTarget;
  const { value, selectionStart, selectionEnd } = input;
  if (selectionStart === null) return;

  // If text is selected, this keystroke replaces it — always allow.
  if (selectionEnd !== null && selectionEnd > selectionStart) return;

  const decimalIndex = value.indexOf('.');
  if (decimalIndex === -1) return; // no decimal point yet, nothing to block

  const decimalDigitsAlready = value.length - decimalIndex - 1;
  if (selectionStart > decimalIndex && decimalDigitsAlready >= 2) {
    e.preventDefault();
  }
}

/** Rounds to 2 decimal places — safety net for paste, autofill, etc. */
export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}