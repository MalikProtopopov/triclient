"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useChangeEmailMutation, useChangePasswordMutation } from "@/entities/auth";
import { useAuth } from "@/providers/AuthProvider";
import { Card, Button, Input } from "@/shared/ui";

const emailSchema = z.object({
  new_email: z.string().email("Некорректный email"),
  current_password: z.string().min(1, "Введите пароль"),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Введите текущий пароль"),
    new_password: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/\d/, "Пароль должен содержать хотя бы одну цифру")
      .regex(/[a-zA-Zа-яА-Я]/, "Пароль должен содержать хотя бы одну букву"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function CabinetSettingsPage() {
  const { user } = useAuth();
  const changeEmailMutation = useChangeEmailMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { new_email: "", current_password: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleChangeEmail = (values: EmailFormValues) => {
    changeEmailMutation.mutate(values, {
      onSuccess: () => {
        toast.success(
          `Письмо с подтверждением отправлено на ${values.new_email}`,
        );
        emailForm.reset();
      },
      onError: () => toast.error("Не удалось сменить email"),
    });
  };

  const handleChangePassword = (values: PasswordFormValues) => {
    changePasswordMutation.mutate(
      {
        current_password: values.current_password,
        new_password: values.new_password,
      },
      {
        onSuccess: () => {
          toast.success("Пароль изменён");
          passwordForm.reset();
        },
        onError: () => toast.error("Не удалось сменить пароль"),
      },
    );
  };

  return (
    <div className="space-y-10">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Настройки
      </h1>

      <section>
        <h2 className="mb-4 text-lg font-medium text-text-primary">
          Смена email
        </h2>
        <Card>
          <form
            onSubmit={emailForm.handleSubmit(handleChangeEmail)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Текущий email
              </label>
              <p className="rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-text-secondary">
                {user?.email ?? "—"}
              </p>
            </div>
            <Input
              label="Новый email"
              type="email"
              {...emailForm.register("new_email")}
              error={emailForm.formState.errors.new_email?.message}
              placeholder="new@example.com"
            />
            <Input
              label="Пароль для подтверждения"
              type="password"
              {...emailForm.register("current_password")}
              error={emailForm.formState.errors.current_password?.message}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              disabled={changeEmailMutation.isPending}
            >
              {changeEmailMutation.isPending
                ? "Отправка..."
                : "Сменить email"}
            </Button>
          </form>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-text-primary">
          Смена пароля
        </h2>
        <Card>
          <form
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className="space-y-4"
          >
            <Input
              label="Текущий пароль"
              type="password"
              {...passwordForm.register("current_password")}
              error={passwordForm.formState.errors.current_password?.message}
              placeholder="••••••••"
            />
            <Input
              label="Новый пароль"
              type="password"
              {...passwordForm.register("new_password")}
              error={passwordForm.formState.errors.new_password?.message}
              placeholder="••••••••"
            />
            <Input
              label="Подтвердите новый пароль"
              type="password"
              {...passwordForm.register("confirm_password")}
              error={passwordForm.formState.errors.confirm_password?.message}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Сохранение..."
                : "Сменить пароль"}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
