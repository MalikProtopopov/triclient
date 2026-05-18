"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/shared/lib";

export interface LightboxPhoto {
  id: string;
  file_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  photos: LightboxPhoto[];
  startIndex?: number;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
}

const SWIPE_THRESHOLD = 60;

export function GalleryLightbox({
  isOpen,
  photos,
  startIndex = 0,
  onClose,
  title,
  isLoading,
}: GalleryLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [openSession, setOpenSession] = useState({ isOpen, startIndex });
  const touchStartX = useRef<number | null>(null);

  if (
    openSession.isOpen !== isOpen ||
    openSession.startIndex !== startIndex
  ) {
    setOpenSession({ isOpen, startIndex });
    if (isOpen) setIndex(startIndex);
  }

  const total = photos.length;
  const goPrev = useCallback(() => {
    if (total === 0) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);
  const goNext = useCallback(() => {
    if (total === 0) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, goPrev, goNext]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const current = photos[index];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
            <div className="min-w-0 flex-1">
              {title && (
                <p className="truncate text-sm font-medium sm:text-base">{title}</p>
              )}
              {total > 0 && (
                <p className="text-xs text-white/60">
                  {index + 1} / {total}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Закрыть"
              className="rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && total === 0 && (
              <Loader2 className="h-10 w-10 animate-spin text-white/70" />
            )}

            {current && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="relative flex h-full w-full items-center justify-center px-2 sm:px-12"
                >
                  <Image
                    src={current.file_url}
                    alt={current.caption ?? `Фото ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="select-none object-contain"
                    priority
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            )}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Предыдущее фото"
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-4 sm:p-3",
                  )}
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Следующее фото"
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-4 sm:p-3",
                  )}
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}
          </div>

          {current?.caption && (
            <div
              className="shrink-0 px-4 py-3 text-center text-sm text-white/80 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {current.caption}
            </div>
          )}

          {total > 1 && (
            <div
              className="shrink-0 overflow-x-auto px-3 pb-3 pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex w-max gap-2">
                {photos.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Перейти к фото ${i + 1}`}
                    className={cn(
                      "relative h-14 w-14 shrink-0 overflow-hidden rounded-md transition-opacity sm:h-16 sm:w-16",
                      i === index
                        ? "ring-2 ring-white"
                        : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={p.thumbnail_url ?? p.file_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
