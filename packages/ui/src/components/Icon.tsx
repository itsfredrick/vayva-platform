import { icons } from 'lucide-react';

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
}

export const Icon = ({ name, size = 24, ...props }: IconProps) => {
    const LucideIcon = icons[name];

    if (!LucideIcon) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Icon ${name} not found`);
        }
        return null;
    }

    // @ts-ignore
    return <LucideIcon size={size} {...props} />;
};
