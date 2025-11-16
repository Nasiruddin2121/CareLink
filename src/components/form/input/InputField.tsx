import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props} // forwards native input props like required, minLength, etc.
      className={`w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 
        focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none 
        dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 
        dark:focus:border-orange-400 dark:focus:ring-orange-400
        transition-all duration-200
        ${props.className}`}
    />
  );
});

Input.displayName = 'Input';
export default Input;
