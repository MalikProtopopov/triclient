"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  usePublicProfile,
  useUpdatePublicMutation,
  useUploadPhotoMutation,
} from "@/entities/profile";
import type { ApiError } from "@/entities/auth";
import { useCities } from "@/entities/doctor";
import { Card, Button, Input, DropdownSelect, PageLoader } from "@/shared/ui";

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
      reset({
        bio: profile.bio,
        public_email: profile.public_email,
        public_phone: profile.public_phone,
        city_id: profile.city_id,
        clinic_name: profile.clinic_name,
        specialization: profile.specialization,
        academic_degree: profile.academic_degree,
      });
    }
  }, [profile, reset, isDirty]);

  const onSubmit = (values: PublicFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success("Изменения отправлены на модерацию");
        reset({
          bio: data.bio,
          public_email: data.public_email,
          public_phone: data.public_phone,
          city_id: data.city_id,
          clinic_name: data.clinic_name,
          specialization: data.specialization,
          academic_degree: data.academic_degree,
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
      onSuccess: () => toast.success("Фото обновлено"),
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

      {profile?.pending_draft && (
        <Card className="border-warning/30 bg-warning/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="font-medium text-text-primary">
                Изменения на модерации
              </p>
              <p className="text-sm text-text-secondary">
                Ваши изменения отправлены{" "}
                {new Date(profile.pending_draft.submitted_at).toLocaleDateString(
                  "ru-RU",
                )}{" "}
                и ожидают проверки
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-4">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt="Фото профиля"
                className="h-[120px] w-[120px] rounded-full object-cover"
              />
            ) : (
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-accent text-3xl font-semibold text-accent-contrast">
                {initials}
              </div>
            )}
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
              disabled={photoMutation.isPending}
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
                className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Расскажите о себе и своей специализации"
              />
            </div>
            <Input
              label="Публичный email"
              type="email"
              {...register("public_email")}
              error={errors.public_email?.message}
            />
            <Input
              label="Публичный телефон"
              {...register("public_phone")}
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
                />
              )}
            />
            <Input
              label="Клиника"
              {...register("clinic_name")}
            />
            <Input
              label="Специализация"
              {...register("specialization")}
            />
            <Input
              label="Научная степень"
              {...register("academic_degree")}
              placeholder="к.м.н., д.м.н. и т.д."
            />
          </div>

          <Button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
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
