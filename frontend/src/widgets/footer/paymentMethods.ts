/** Логотипы в /public/payment-methods/ — порядок отображения и подписи для требований эквайера. */
export const PAYMENT_METHOD_ITEMS = [
  { id: "mir", file: "mir.svg", label: "«Мир»" },
  { id: "visa", file: "visa.svg", label: "Visa" },
  { id: "mastercard", file: "mastercard.svg", label: "Mastercard" },
  { id: "sbp", file: "sbp.svg", label: "СБП" },
  { id: "iomoney", file: "iomoney.svg", label: "ЮMoney" },
  { id: "payservices", file: "payservices.svg", label: "Платёжные сервисы" },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHOD_ITEMS)[number]["id"];
