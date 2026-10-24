import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  autoComplete = 'off',
  disabled = false,
  rightElement,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full text-left space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
          {label} {required && <span className="text-[#D4AF37]">*</span>}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#D4AF37] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full bg-[#141414]/90 text-white text-sm rounded-xl py-3 ${
            Icon ? 'pl-10' : 'pl-4'
          } ${
            isPassword || rightElement ? 'pr-11' : 'pr-4'
          } border ${
            error
              ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
              : 'border-[#2D2D2D] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50'
          } transition-all duration-200 outline-none placeholder:text-gray-600 shadow-inner`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#D4AF37] focus:outline-none transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {!isPassword && rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 font-medium pl-1">{error}</p>}
    </div>
  );
}
