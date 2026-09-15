import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      id,
      required,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const helperId = id ? `${id}-helper` : undefined;
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "h-11 w-full rounded-lg border bg-surface px-3 text-sm text-foreground",
              "placeholder:text-text-disabled",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
              "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-disabled",
              error
                ? "border-danger"
                : "border-border-strong focus-visible:border-brand-purple",
              startIcon && "pl-10",
              endIcon && "pr-10",
              className,
            )}
            {...props}
          />

          {endIcon && (
            <div className="absolute inset-y-0 right-3 z-10 flex items-center text-text-secondary">
              {endIcon}
            </div>
          )}
        </div>

        {error ? (
          <p id={errorId} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="mt-1.5 text-sm text-text-secondary"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
