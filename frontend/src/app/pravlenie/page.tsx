import Image from "next/image";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

const BOARD = [
  {
    id: 1,
    photo:
      "/media/gadzhigoroeva-aida-guseyhanovna-prezident-associacii-professionalnoe-obshchestvo-trihologov.jpg",
    name: "Гаджигороева Аида Гусейхановна",
    role: "Президент ассоциации",
    degree: "Доктор медицинских наук",
    specialization: "Врач-дерматолог, косметолог, трихолог",
    facts: [
      "Главный научный сотрудник ГБУ «Московский научно-практический центр дерматовенерологии и косметологии»",
      "Член Европейского общества исследования волос (EHRS)",
      "Главный врач клиники «Институт Красивых Волос»",
      "Автор монографии «Клиническая трихология»",
      "Автор более 100 научных работ, статей и глав в книгах",
      "Спикер российских и зарубежных конференций",
    ],
  },
  {
    id: 2,
    photo:
      "/media/vavilov-vladimir-vladimirovich-chlen-pravleniya-associacii-professionalnoe-obshchestvo-trihologov.jpg",
    name: "Вавилов Владимир Владимирович",
    role: "Член Правления",
    degree: "Кандидат медицинских наук",
    specialization: "Врач-дерматолог, трихолог, дерматоонколог",
    facts: [
      "Член EADV (European Academy of Dermatology and Venereology)",
      "Автор работ в отечественных и зарубежных научных изданиях",
      "Спикер российских и зарубежных научно-практических конференций",
      "Свободно владеет английским, французским и немецким языками",
    ],
  },
  {
    id: 3,
    photo:
      "/media/haldina-mariya-vladimirovna-chlen-pravleniya-associacii-professionalnoe-obshchestvo-trihologov.jpg",
    name: "Халдина Мария Владимировна",
    role: "Член Правления",
    degree: "Кандидат медицинских наук",
    specialization: "Врач-дерматовенеролог, косметолог, физиотерапевт, трихолог",
    facts: [
      "Главный врач клиники косметологии и трихологии «БиоМи Вита»",
      "Спикер и участник российских и зарубежных конференций",
      "Научный редактор журнала «ТРИХОЛОГИЯ»",
    ],
  },
];

export default function PravleniePage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        {/* Шапка */}
        <div className="border-b border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Ассоциация трихологов
            </p>
            <h1 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
              Правление
            </h1>
            <p className="mt-3 max-w-xl text-text-secondary">
              Руководство «Профессионального общества трихологов» — ведущие эксперты в области
              трихологии и дерматологии России
            </p>
          </div>
        </div>

        {/* Карточки правления */}
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          <div className="space-y-0 divide-y divide-border">
            {BOARD.map((member, i) => (
              <div
                key={member.id}
                className="group grid gap-8 py-14 first:pt-0 last:pb-0 lg:grid-cols-[320px_1fr] lg:gap-14"
              >
                {/* Фото */}
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={320}
                      height={400}
                      className="h-[360px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] lg:h-[400px]"
                    />
                    {/* Нижний градиент */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#4a4a4a]/50 to-transparent" />
                  </div>
                  {/* Роль поверх фото внизу */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span
                      className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-[#4a4a4a] backdrop-blur-sm"
                      style={{ background: "rgba(237,190,204,0.9)" }}
                    >
                      {member.role}
                    </span>
                  </div>

                  {/* Порядковый номер */}
                  <div
                    className="absolute -top-4 -right-4 hidden font-heading text-[80px] font-bold leading-none text-border-light/50 select-none lg:block"
                  >
                    0{i + 1}
                  </div>
                </div>

                {/* Информация */}
                <div className="flex flex-col justify-center">
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                    {member.role}
                  </p>
                  <h2 className="font-heading text-2xl font-bold text-text-primary lg:text-3xl">
                    {member.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-[#4a4a4a]"
                      style={{ background: "rgba(237,190,204,0.3)" }}
                    >
                      {member.degree}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-text-secondary">
                    {member.specialization}
                  </p>

                  {/* Разделитель */}
                  <div
                    className="my-5 h-[1px] w-12"
                    style={{ background: "#edbecc" }}
                  />

                  {/* Факты */}
                  <ul className="space-y-2.5">
                    {member.facts.map((fact) => (
                      <li key={fact} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ background: "#edbecc" }}
                        />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
