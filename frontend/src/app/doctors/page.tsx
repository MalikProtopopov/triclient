import DoctorsClient from "./DoctorsClient";

export const metadata = {
  title: "Врачи — члены организации | Организация трихологов",
  description:
    "Каталог врачей-трихологов — членов Организации трихологов. Верифицированные специалисты с подтверждённой квалификацией.",
};

export default function DoctorsPage() {
  return <DoctorsClient />;
}
