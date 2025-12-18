import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className, id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className={`flex items-start ${className || ''}`}>
                <div className="flex h-5 items-center">
                    <input
                        id={inputId}
                        ref={ref}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#22C55E] focus:ring-[#22C55E] transition-colors cursor-pointer"
                        {...props}
                    />
                </div>
                <div className="ml-3 text-sm leading-5">
                    <label htmlFor={inputId} className="font-medium text-gray-700 cursor-pointer">
                        {label}
                    </label>
                </div>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
