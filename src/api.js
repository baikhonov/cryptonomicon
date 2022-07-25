const API_KEY =
  "08370e45f2a5e91bf88e5da8f62d4ff02a9da648d2a18f63e934af4ece155e9e";

const tickersHandlers = new Map();

// TODO: refactor to use URLSearchParams
const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  // const subscribers = tickersHandlers.get(ticker) || [];
  // tickersHandlers.set(
  //   ticker,
  //   subscribers.filter((fn) => fn !== cb)
  // );
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickersHandlers = tickersHandlers;
