export const formatPrice = (price: number): string => {
  if (price === 0) return "Бесплатно";
  return `${price.toLocaleString("ru-RU")} ₽`;
};
