import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand-color)",
        primary: "var(--brand-color)",
        background: "var(--color-background)",
      },
    },
  },
  plugins: [],
};
export default config;
