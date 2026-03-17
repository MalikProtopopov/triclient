"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, Input, Select, Card } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatPhoneInput, formatPhoneForApi } from "@/shared/lib/phoneMask";
import { useCities } from "@/entities/doctor";
import { useOnboardingStatus, authApi } from "@/entities/auth";
import type { OnboardingNextStep } from "@/entities/auth";
import { getOnboardingStepRoute } from "@/providers/AuthProvider";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface FileState {
  file: File | null;
  name: string;
  size: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function FileUploadZone({
  label,
  required,
  file,
  onFileChange,
}: {
  label: string;
  required?: boolean;
  file: FileState | null;
  onFileChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.size <= MAX_SIZE_BYTES && /\.(pdf|jpg|jpeg|png)$/i.test(f.name)) {
      onFileChange(f);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size <= MAX_SIZE_BYTES) onFileChange(f);
    e.target.value = "";
  };

  const handleRemove = () => onFileChange(null);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3">
          <Check className="h-5 w-5 shrink-0 text-green-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-text-primary">{file.name}</p>
            <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded p-1 text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
            aria-label="Удалить файл"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-bg-secondary py-8 transition-colors hover:border-accent/50 hover:bg-bg"
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleChange}
            className="hidden"
          />
          <Upload className="h-10 w-10 text-text-muted" />
          <p className="text-center text-sm text-text-secondary">
            Перетащите файл или нажмите для загрузки
          </p>
          <p className="text-xs text-text-muted">PDF, JPG, PNG до 10 МБ</p>
        </div>
      )}
    </div>
  );
}

const STEP_LABELS: { step: OnboardingNextStep; label: string }[] = [
  { step: "choose_role", label: "Роль" },
  { step: "fill_profile", label: "Анкета" },
  { step: "upload_documents", label: "Документы" },
  { step: "submit", label: "Отправка" },
];

const STEP_ORDER: OnboardingNextStep[] = [
  "choose_role",
  "fill_profile",
  "upload_documents",
  "submit",
];

function OnboardingProgress({ currentStep }: { currentStep: OnboardingNextStep }) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="mb-8 flex items-center gap-0">
      {STEP_LABELS.map(({ step, label }, i) => {
        const idx = STEP_ORDER.indexOf(step);
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-accent text-white"
                    : isCurrent
                      ? "border-2 border-accent bg-bg text-accent"
                      : "border-2 border-border bg-bg text-text-muted"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`mt-1 whitespace-nowrap text-xs ${
                  isCurrent ? "font-medium text-accent" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`mb-5 h-0.5 flex-1 transition-colors ${idx < currentIndex ? "bg-accent" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const VALID_STEPS = new Set(["fill_profile", "upload_documents", "submit"]);

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { data: citiesData } = useCities({ withDoctors: false });
  const { data: status, isLoading: statusLoading } = useOnboardingStatus();
  const cities = citiesData ?? [];

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [passport, setPassport] = useState("");
  const [cityId, setCityId] = useState("");
  const [clinic, setClinic] = useState("");
  const [position, setPosition] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [academicDegree, setAcademicDegree] = useState("");
  const [diplomaFile, setDiplomaFile] = useState<FileState | null>(null);
  const [certificateFile, setCertificateFile] = useState<FileState | null>(null);
  const [extraFiles, setExtraFiles] = useState<FileState[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setDiploma = (f: File | null) =>
    setDiplomaFile(f ? { file: f, name: f.name, size: f.size } : null);
  const setCertificate = (f: File | null) =>
    setCertificateFile(f ? { file: f, name: f.name, size: f.size } : null);

  if (status && !VALID_STEPS.has(status.next_step) && status.moderation_status !== "rejected") {
    router.replace(getOnboardingStepRoute(status.next_step));
    return null;
  }

  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }));

  const requiredFilled =
    lastName.trim() && firstName.trim() && phone.trim() && cityId && diplomaFile;

  const uploadFile = async (file: FileState, documentType: string) => {
    if (!file.file) return;
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("document_type", documentType);
    await authApi.uploadDocument(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredFilled) return;
    setIsSubmitting(true);
    try {
      await authApi.saveDoctorProfile({
        last_name: lastName,
        first_name: firstName,
        middle_name: middleName || undefined,
        phone: formatPhoneForApi(phone),
        passport_data: passport || undefined,
        city_id: cityId,
        clinic_name: clinic || undefined,
        position: position || undefined,
        specialization: specialization || undefined,
        academic_degree: academicDegree || undefined,
      });

      if (diplomaFile) await uploadFile(diplomaFile, "medical_diploma");
      if (certificateFile) await uploadFile(certificateFile, "retraining_cert");
      for (const extra of extraFiles) {
        if (extra.file) await uploadFile(extra, "additional_cert");
      }

      await authApi.submitOnboarding();
      toast.success("Заявка отправлена на модерацию");
      router.push(ROUTES.ONBOARDING_PENDING);
    } catch {
      toast.error("Ошибка при отправке заявки");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  const currentStep: OnboardingNextStep = status?.next_step ?? "fill_profile";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <OnboardingProgress currentStep={currentStep} />

          <h1 className="mb-4 text-2xl font-semibold text-text-primary">Заполните анкету</h1>

          {status?.moderation_status === "rejected" && status.rejection_comment && (
            <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 px-5 py-4 text-sm text-red-700 dark:text-red-400">
              <strong>Заявка отклонена.</strong> Причина: {status.rejection_comment}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <Card>
              <h2 className="mb-4 text-lg font-medium text-text-primary">Личные данные</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Иванов"
                />
                <Input
                  label="Имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Иван"
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Отчество"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Иванович"
                />
                <Input
                  label="Телефон"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                  required
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="mt-4 space-y-4">
                <Input
                  label="Паспортные данные"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  placeholder="Серия и номер"
                />
                <Select
                  label="Город"
                  options={cityOptions}
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  placeholder="Выберите город"
                  required
                />
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-lg font-medium text-text-primary">
                Профессиональные данные
              </h2>
              <div className="space-y-4">
                <Input
                  label="Клиника"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  placeholder="Название клиники"
                />
                <Input
                  label="Должность"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Врач-трихолог"
                />
                <Input
                  label="Специализация"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Трихология"
                />
                <Input
                  label="Научная степень"
                  value={academicDegree}
                  onChange={(e) => setAcademicDegree(e.target.value)}
                  placeholder="к.м.н., д.м.н."
                />
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-lg font-medium text-text-primary">Документы</h2>
              <div className="space-y-4">
                <FileUploadZone
                  label="Диплом о высшем медицинском образовании"
                  required
                  file={diplomaFile}
                  onFileChange={setDiploma}
                />
                <FileUploadZone
                  label="Сертификат о переподготовке"
                  file={certificateFile}
                  onFileChange={setCertificate}
                />
                <FileUploadZone
                  label="Дополнительные сертификаты"
                  file={extraFiles[0] ?? null}
                  onFileChange={(f) =>
                    setExtraFiles(f ? [{ file: f, name: f.name, size: f.size }] : [])
                  }
                />
                {!diplomaFile && (
                  <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                    Без диплома о высшем мед. образовании оплата членского взноса будет недоступна
                  </div>
                )}
              </div>
            </Card>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={!requiredFilled || isSubmitting}
              isLoading={isSubmitting}
            >
              {status?.moderation_status === "rejected"
                ? "Исправить и отправить заново"
                : "Отправить заявку на проверку"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
