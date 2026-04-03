let _incrementQuotesViewed: (() => void) | null = null;

export function setIncrementQuotesViewed(fn: () => void) {
  _incrementQuotesViewed = fn;
}

export function notifyQuoteViewed() {
  _incrementQuotesViewed?.();
}
