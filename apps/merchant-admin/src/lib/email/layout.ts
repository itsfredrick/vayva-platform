import { Colors, Typography, Spacing, Borders } from "./design-system";

export const BRAND_COLOR = Colors.Brand.Primary;

export function wrapEmail(content: string, preheader: string = "Vayva Notification"): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; color: #333; }
  </style>
</head>
<body>
    <div class="container">
      ${content}
    </div>
</body>
</html>
  `;
}

export function renderButton(url: string, label: string): string {
    return `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="background-color: ${BRAND_COLOR}; color: #ffffff; display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
        ${label}
      </a>
    </div>
  `;
}
