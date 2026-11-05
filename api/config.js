
export const catalog = Object.freeze({
  bronze: {
    label: "Bronze",
    prices: { 1: 4970, 2: 6461, 3: 8201 }
  },
  prata: {
    label: "Prata",
    prices: { 1: 7990, 2: 10387, 3: 13184 }
  },
  ouro: {
    label: "Ouro",
    prices: { 1: 9990, 2: 12987, 3: 16484 }
  }
});

export function priceFor(plan, quantity) {
  const item = catalog[plan];

  if (!item || !Number.isInteger(quantity) ||
      ![1, 2, 3].includes(quantity)) {
    throw new Error("Plano ou quantidade inválida");
  }

  return {
    product: item.prices[quantity],
    shipping: 0,
    total: item.prices[quantity]
  };
}
