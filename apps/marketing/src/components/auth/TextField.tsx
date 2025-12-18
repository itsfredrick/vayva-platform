import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    rightElement?: ReactNode; // For password toggle or icons
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, error, helperText, className, rightElement, id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className={`space-y-1.5 ${className || ''}`}>
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <div className="relative">
                    <input
                        id={inputId}
                        ref={ref}
                        className={`
                            block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset transition-all
                            placeholder:text-gray-400 
                            focus:ring-2 focus:ring-inset focus:outline-none
                            ${error
                                ? 'ring-red-300 focus:ring-red-500 bg-red-50/50'
                                : 'ring-slate-900/10 focus:ring-[#22C55E]/50 bg-white/60 hover:bg-white/80'
                            }
                            sm:text-sm sm:leading-6
                        `}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
            </div>
        );
    }
);

TextField.displayName = 'TextField';
