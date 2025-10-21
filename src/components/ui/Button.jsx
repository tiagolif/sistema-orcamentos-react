import React from 'react';
import { clsx } from 'clsx';

const Button = React.forwardRef(
  ({ children, variant = 'primary', className, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary: 'bg-accent text-accent-text px-4 py-2 font-semibold hover:bg-accent-hover hover:-translate-y-px',
      secondary: 'bg-gray-200 text-text-primary px-4 py-2 font-semibold hover:bg-gray-300 hover:-translate-y-px',
      danger: 'px-4 py-2 text-red-600 hover:bg-red-100',
      ghost: 'px-4 py-2 text-accent hover:bg-accent/10',
    };

    // clsx mescla as classes: base, da variante e as passadas externamente via `className`
    const mergedClasses = clsx(
      baseStyles,
      variantStyles[variant],
      className, // Permite sobrescrever ou adicionar classes
    );

    return (
      <button className={mergedClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
