import Image from "next/image";

import { PAYMENT_METHOD_ITEMS } from "./paymentMethods";

/**
 * Блок под футером: логотипы и текстовый перечень способов оплаты (требования платёжного провайдера).
 */
export const PaymentMethodsStrip = () => {
  const listText = PAYMENT_METHOD_ITEMS.map((m) => m.label).join(" · ");

  return (
    <section
      className="border-t border-border bg-bg-secondary"
      aria-labelledby="payment-methods-title"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <h2
          id="payment-methods-title"
          className="mb-1 text-center font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted sm:text-left"
        >
          Принимаем к оплате
        </h2>
        <p className="mb-4 text-center text-xs leading-relaxed text-text-secondary sm:text-left">
          Банковские карты платёжных систем «Мир», Visa и Mastercard, Система быстрых платежей (СБП),
          ЮMoney и другие доступные способы.
        </p>

        <ul
          className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start"
          aria-label="Логотипы способов оплаты"
        >
          {PAYMENT_METHOD_ITEMS.map((m) => (
            <li key={m.id}>
              <div
                className="flex h-11 min-h-11 items-center justify-center rounded-lg border border-border bg-white px-3 py-2 shadow-[0_1px_2px_rgba(74,74,74,0.06)]"
                title={m.label}
              >
                <Image
                  src={`/payment-methods/${m.file}`}
                  alt={m.label}
                  width={120}
                  height={40}
                  className="max-h-7 w-auto max-w-[5.25rem] object-contain object-center"
                  unoptimized
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-text-muted sm:text-left">
          <span className="font-medium text-text-secondary">Доступные способы оплаты: </span>
          {listText}
        </p>
      </div>
    </section>
  );
};
