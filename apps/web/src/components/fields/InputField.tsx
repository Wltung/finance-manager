import { useState } from "react";
import { FiEye, FiEyeOff } from 'react-icons/fi';

// Custom components
function InputField(props: {
  id: string;
  label: string;
  extra?: string;
  placeholder: string;
  variant?: string;
  state?: 'error' | 'success';
  disabled?: boolean;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  error?: string;
  showPasswordToggle?: boolean;
}) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    state: propState,
    disabled,
    onChange,
    value,
    error,
    showPasswordToggle = false 
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const state = error ? 'error' : propState;

  // Determine actual input type
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          onChange={onChange}
          disabled={disabled}
          type={inputType}
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
            showPasswordToggle && type === 'password' ? 'pr-12' : ''
          } ${
            disabled === true
              ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
              : state === "error"
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
              : state === "success"
              ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
              : "border-gray-200 dark:!border-white/10 dark:text-white"
          }`}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="ml-1.5 mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
