import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 text-sm border border-surface-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={error ? 'text-red-500' : 'text-surface-400'} 
            />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={error ? 'text-red-500' : 'text-surface-400'} 
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;