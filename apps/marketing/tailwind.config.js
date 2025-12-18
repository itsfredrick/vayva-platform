/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                vayva: {
                    green: '#22C55E',
                    'green-dark': '#16A34A',
                    bg: '#F7FAF7',
                }
            },
            backdropBlur: {
                glass: '18px',
            },
            borderRadius: {
                glass: '16px',
            }
        },
    },
    plugins: [],
};
