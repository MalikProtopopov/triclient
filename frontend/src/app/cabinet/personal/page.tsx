"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  usePersonalProfile,
  useUpdatePersonalMutation,
  useUploadDiplomaMutation,
} from "@/entities/profile";
import { Card, Button, Input, PageLoader } from "@/shared/ui";
import { formatShortDate } from "@/shared/lib/format";

const personalSchema = z.object({
  first_name: z.string().min(1, "Обязательное поле"),
  last_name: z.string().min(1, "Обязательное поле"),
  middle_name: z.string().nullable(),
  phone: z.string().nullable(),
  passport_data: z.string().nullable(),
  registration_address: z.string().nullable(),
  city: z.string().nullable(),
  clinic_name: z.string().nullable(),
  position: z.string().nullable(),
  specialization: z.string().nullable(),
  academic_degree: z.string().nullable(),
  colleague_contacts: z.string().nullable(),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export default function PersonalInfoPage() {
  const { data: profile, isLoading } = usePersonalProfile();
  const updateMutation = useUpdatePersonalMutation();
  const diplomaMutation = useUploadDiplomaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: null,
      phone: null,
      passport_data: null,
      registration_address: null,
      city: null,
      clinic_name: null,
      position: null,
      specialization: null,
      academic_degree: null,
      colleague_contacts: null,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        middle_name: profile.middle_name,
        phone: profile.phone,
        passport_data: profile.passport_data,
        registration_address: profile.registration_address,
        city: profile.city,
        clinic_name: profile.clinic_name,
        position: profile.position,
        specialization: profile.specialization,
        academic_degree: profile.academic_degree,
        colleague_contacts: profile.colleague_contacts,
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: PersonalFormValues) => {
    const changed: Record<string, unknown> = {};
    for (const key of Object.keys(dirtyFields) as (keyof PersonalFormValues)[]) {
      changed[key] = values[key];
    }
    if (Object.keys(changed).length === 0) return;

    updateMutation.mutate(changed as Partial<PersonalFormValues>, {
      onSuccess: () => toast.success("Данные сохранены"),
      onError: () => toast.error("Не удалось сохранить данные"),
    });
  };

  const handleDiplomaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    diplomaMutation.mutate(fd, {
      onSuccess: () => toast.success("Фото диплома загружено"),
      onError: () => toast.error("Не удалось загрузить фото диплома"),
    });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Личная информация
      </h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Фамилия"
              {...register("last_name")}
              error={errors.last_name?.message}
            />
            <Input
              label="Имя"
              {...register("first_name")}
              error={errors.first_name?.message}
            />
            <Input label="Отчество" {...register("middle_name")} />
            <Input label="Телефон" {...register("phone")} />
            <Input label="Город" {...register("city")} />
            <Input label="Клиника" {...register("clinic_name")} />
            <Input label="Должность" {...register("position")} />
            <Input label="Специализация" {...register("specialization")} />
            <Input
              label="Научная степень"
              {...register("academic_degree")}
              placeholder="к.м.н., д.м.н. и т.д."
            />
            <Input
              label="Контакты коллег"
              {...register("colleague_contacts")}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Паспортные данные"
              {...register("passport_data")}
              className="sm:col-span-2"
            />
            <Input
              label="Адрес регистрации"
              {...register("registration_address")}
              className="sm:col-span-2"
            />
          </div>

          {/* Diploma Photo */}
          <div className="border-t border-border pt-6">
            <h3 className="mb-4 text-sm font-medium text-text-primary">
              Фото диплома
            </h3>
            {profile?.diploma_photo_url && (
              <div className="mb-4">
                <img
                  src={profile.diploma_photo_url}
                  alt="Диплом"
                  className="h-32 rounded-lg border border-border object-cover"
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleDiplomaUpload}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={diplomaMutation.isPending}
            >
              <Upload className="mr-1.5 h-4 w-4" />
              {diplomaMutation.isPending
                ? "Загрузка..."
                : "Загрузить фото диплома"}
            </Button>
          </div>

          {/* Documents */}
          {profile?.documents && profile.documents.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="mb-4 text-sm font-medium text-text-primary">
                Загруженные документы
              </h3>
              <ul className="space-y-2">
                {profile.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3">
                    <FileText className="h-4 w-4 shrink-0 text-text-muted" />
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      {doc.name}
                    </a>
                    <span className="text-xs text-text-muted">
                      {formatShortDate(doc.uploaded_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
