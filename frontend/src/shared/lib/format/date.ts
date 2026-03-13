import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), "d MMMM yyyy", { locale: ru });
};

export const formatDateTime = (dateStr: string): string => {
  return format(parseISO(dateStr), "d MMMM yyyy, HH:mm", { locale: ru });
};

export const formatShortDate = (dateStr: string): string => {
  return format(parseISO(dateStr), "dd.MM.yyyy");
};
