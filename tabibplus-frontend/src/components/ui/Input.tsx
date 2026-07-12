import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="group relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border border-gray-200 bg-white/50 py-2.5 ${
              icon ? "pl-10" : "pl-3"
            } pr-3 text-gray-900 transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";