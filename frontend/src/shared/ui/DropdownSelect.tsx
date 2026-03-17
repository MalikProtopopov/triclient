"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib";

interface SelectOption {
  value: string;
  label: string;
}

export interface DropdownSelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: React.FocusEventHandler;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DropdownSelect = forwardRef<HTMLSelectElement, DropdownSelectProps>(
  (
    {
      className,
      label,
      error,
      options,
      placeholder,
      value = "",
      onChange,
      onBlur,
      name,
      id,
      required,
      disabled,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    const hasEmptyOption = options.some((o) => o.value === "");
    const displayOptions =
      placeholder && !hasEmptyOption
        ? [{ value: "", label: placeholder }, ...options]
        : options;
    const selectedOption = displayOptions.find((o) => o.value === value);
    const displayLabel = selectedOption?.label ?? placeholder ?? "";

    const close = useCallback(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
      onBlur?.({ target: { name } } as unknown as React.FocusEvent);
    }, [onBlur, name]);

    const handleSelect = useCallback(
      (opt: SelectOption) => {
        onChange?.({ target: { value: opt.value, name: name ?? "" } } as React.ChangeEvent<HTMLSelectElement>);
        close();
      },
      [onChange, name, close],
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          close();
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, close]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!containerRef.current?.contains(document.activeElement)) {
          return;
        }
        if (!isOpen) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(value ? displayOptions.findIndex((o) => o.value === value) : 0);
          }
          return;
        }
        switch (e.key) {
          case "Escape":
            e.preventDefault();
            close();
            break;
          case "ArrowDown":
            e.preventDefault();
            setHighlightedIndex((i) =>
              i < displayOptions.length - 1 ? i + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((i) =>
              i > 0 ? i - 1 : displayOptions.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < displayOptions.length) {
              handleSelect(displayOptions[highlightedIndex]);
            }
            break;
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, displayOptions, close, handleSelect]);

    useEffect(() => {
      if (isOpen && listRef.current && highlightedIndex >= 0) {
        const el = listRef.current.children[highlightedIndex] as HTMLElement;
        el?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    return (
      <div className={cn("space-y-1.5", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
            {required && <span className="text-error"> *</span>}
          </label>
        )}
        <div ref={containerRef} className="relative">
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            tabIndex={-1}
            type="hidden"
            name={name}
            value={value}
            readOnly
          />
          <button
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((o) => !o)}
            onFocus={() => setHighlightedIndex(displayOptions.findIndex((o) => o.value === value))}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-2.5 pr-10 text-left text-sm text-text-primary transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error",
              !displayLabel && "text-text-muted",
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? `${selectId}-label` : undefined}
          >
            <span>{displayLabel}</span>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-transform",
                isOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {isOpen && (
            <ul
              ref={listRef}
              role="listbox"
              className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-bg-secondary py-1 shadow-lg"
            >
              {displayOptions.map((opt, i) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors",
                    opt.value === value
                      ? "bg-accent/10 text-accent"
                      : "text-text-primary hover:bg-bg-tertiary",
                    highlightedIndex === i && "bg-bg-tertiary",
                    placeholder && opt.value === "" && "text-text-muted",
                  )}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <Check className="h-4 w-4 shrink-0" aria-hidden />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  },
);

DropdownSelect.displayName = "DropdownSelect";
