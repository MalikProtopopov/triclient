"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  usePublicProfile,
  useUpdatePublicMutation,
  useUploadPhotoMutation,
} from "@/entities/profile";
import type { ApiError } from "@/entities/auth";
import type {
  PublicProfile,
  PublicProfileDraft,
  UploadPhotoResponse,
} from "@/entities/profile";
import { useCities } from "@/entities/doctor";
import { Card, Button, Input, DropdownSelect, PageLoader } from "@/shared/ui";
import { resolvePendingPhotoUrl } from "@/shared/config";

function getDisplayData(profile: PublicProfile): {
  bio: string | null;
  public_email: string | null;
  public_phone: string | null;
  city_id: string | null;
  clinic_name: string | null;
  specialization: string | null;
  academic_degree: string | null;
  photo_url: string | null;
} {
  const draft = profile.pending_draft;
  const cityId = profile.city?.id ?? profile.city_id ?? null;

  if (!draft) {
    return {
      bio: profile.bio,
      public_email: profile.public_email,
      public_phone: profile.public_phone,
      city_id: cityId,
      clinic_name: profile.clinic_name,
      specialization: profile.specialization,
      academic_degree: profile.academic_degree,
      photo_url: profile.photo_url,
    };
  }

  const c = draft.changes ?? {};
  const photoKey = c.photo_url ?? draft.photo_url;
  return {
    bio: c.bio ?? draft.bio ?? profile.bio,
    public_email: c.public_email ?? draft.public_email ?? profile.public_email,
    public_phone: c.public_phone ?? draft.public_phone ?? profile.public_phone,
    city_id: c.city_id ?? draft.city_id ?? cityId,
    clinic_name: c.clinic_name ?? draft.clinic_name ?? profile.clinic_name,
    specialization: c.specialization ?? draft.specialization ?? profile.specialization,
    academic_degree: c.academic_degree ?? draft.academic_degree ?? profile.academic_degree,
    photo_url: photoKey
      ? resolvePendingPhotoUrl(photoKey as string) ?? null
      : profile.photo_url,
  };
}

const publicSchema = z.object({
  bio: z.string().nullable(),
  public_email: z.string().email("Некорректный email").nullable().or(z.literal("")),
  public_phone: z.string().nullable(),
  city_id: z.string().nullable(),
  clinic_name: z.string().nullable(),
  specialization: z.string().nullable(),
  academic_degree: z.string().nullable(),
});

type PublicFormValues = z.infer<typeof publicSchema>;

export default function PublicProfilePage() {
  const { data: profile, isLoading } = usePublicProfile();
  const { data: cities = [] } = useCities();
  const updateMutation = useUpdatePublicMutation();
  const photoMutation = useUploadPhotoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingAfterReject, setIsEditingAfterReject] = useState(false);

  const draft = profile?.pending_draft;
  const isFormLocked = !!draft && !isEditingAfterReject;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PublicFormValues>({
    resolver: zodResolver(publicSchema),
    defaultValues: {
      bio: null,
      public_email: null,
      public_phone: null,
      city_id: null,
      clinic_name: null,
      specialization: null,
      academic_degree: null,
    },
  });

  useEffect(() => {
    if (profile && !isDirty) {
      const display = getDisplayData(profile);
      reset({
        bio: display.bio,
        public_email: display.public_email,
        public_phone: display.public_phone,
        city_id: display.city_id,
        clinic_name: display.clinic_name,
        specialization: display.specialization,
        academic_degree: display.academic_degree,
      });
    }
  }, [profile, reset, isDirty]);

  const onSubmit = (values: PublicFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success("Изменения отправлены на модерацию");
        setIsEditingAfterReject(false);
        const display = getDisplayData(data as PublicProfile);
        reset({
          bio: display.bio,
          public_email: display.public_email,
          public_phone: display.public_phone,
          city_id: display.city_id,
          clinic_name: display.clinic_name,
          specialization: display.specialization,
          academic_degree: display.academic_degree,
        });
      },
      onError: (error) => {
        const axiosErr = error as AxiosError<ApiError>;
        const code = axiosErr.response?.data?.error?.code;
        if (code === "DRAFT_ALREADY_PENDING") {
          toast.error("У вас уже есть изменения на модерации");
        } else {
          toast.error("Не удалось сохранить изменения");
        }
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    photoMutation.mutate(fd, {
      onSuccess: (data: UploadPhotoResponse) => {
        toast.success(
          data.message ??
            "Фото отправлено на модерацию. Изменения появятся на сайте после одобрения администратором",
        );
      },
      onError: () => toast.error("Не удалось загрузить фото"),
    });
  };

  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }));
  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Публичный профиль
      </h1>

      {draft?.status === "pending" && (
        <Card className="border-warning/30 bg-warning/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="font-medium text-text-primary">
                Изменения на модерации
              </p>
              <p className="text-sm text-text-secondary">
                Ваши изменения отправлены{" "}
                {new Date(draft.submitted_at).toLocaleDateString("ru-RU")} и
                ожидают проверки
              </p>
            </div>
          </div>
        </Card>
      )}

      {draft?.status === "rejected" && !isEditingAfterReject && (
        <Card className="border-error/30 bg-error/5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 shrink-0 text-error" />
              <div>
                <p className="font-medium text-text-primary">
                  Изменения отклонены
                </p>
                <p className="text-sm text-text-secondary">
                  Дата рассмотрения:{" "}
                  {draft.reviewed_at
                    ? new Date(draft.reviewed_at).toLocaleDateString("ru-RU")
                    : "—"}
                </p>
              </div>
            </div>
            {draft.rejection_reason && (
              <p className="text-sm text-text-primary pl-8">
                Причина: {draft.rejection_reason}
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingAfterReject(true)}
              className="self-start"
            >
              Исправить и отправить заново
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-4">
            {(() => {
              const draftPhotoKey =
                profile?.pending_draft?.changes?.photo_url ??
                profile?.pending_draft?.photo_url;
              const draftPhotoUrl = resolvePendingPhotoUrl(draftPhotoKey);
              const displayPhotoUrl =
                draftPhotoUrl ?? profile?.photo_url ?? null;
              const showModerationBadge =
                profile?.photo_pending_moderation ?? !!draftPhotoKey;

              return (
                <>
                  {displayPhotoUrl ? (
                    <img
                      src={displayPhotoUrl}
                      alt="Фото профиля"
                      className="h-[120px] w-[120px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-accent text-3xl font-semibold text-accent-contrast">
                      {initials}
                    </div>
                  )}
                  {showModerationBadge && (
                    <p className="text-center text-xs text-warning">
                      {draftPhotoKey
                        ? "Новое фото на модерации"
                        : "Фото на модерации"}
                    </p>
                  )}
                </>
              );
            })()}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoMutation.isPending || isFormLocked}
            >
              <Upload className="mr-1.5 h-4 w-4" />
              {photoMutation.isPending ? "Загрузка..." : "Загрузить фото"}
            </Button>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Краткое описание
              </label>
              <textarea
                {...register("bio")}
                rows={4}
                disabled={isFormLocked}
                className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Расскажите о себе и своей специализации"
              />
            </div>
            <Input
              label="Публичный email"
              type="email"
              {...register("public_email")}
              error={errors.public_email?.message}
              disabled={isFormLocked}
            />
            <Input
              label="Публичный телефон"
              {...register("public_phone")}
              disabled={isFormLocked}
            />
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <DropdownSelect
                  label="Город"
                  options={[
                    { value: "", label: "Выберите город" },
                    ...cityOptions,
                  ]}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={isFormLocked}
                />
              )}
            />
            <Input
              label="Клиника"
              {...register("clinic_name")}
              disabled={isFormLocked}
            />
            <Input
              label="Специализация"
              {...register("specialization")}
              disabled={isFormLocked}
            />
            <Input
              label="Научная степень"
              {...register("academic_degree")}
              placeholder="к.м.н., д.м.н. и т.д."
              disabled={isFormLocked}
            />
          </div>

          <Button
            type="submit"
            disabled={isFormLocked || !isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending
              ? "Сохранение..."
              : "Сохранить изменения"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
