import DoctorsClient from "./DoctorsClient";

export const metadata = {
  title: "Врачи — члены ассоциации | Ассоциация трихологов",
  description:
    "Каталог врачей-трихологов — членов Ассоциации трихологов. Верифицированные специалисты с подтверждённой квалификацией.",
};

export default function DoctorsPage() {
  return <DoctorsClient />;
}
