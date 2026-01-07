import { BRAND } from "@vayva/shared";

// --- Constants ---
const Colors = {
  Background: "#FFFFFF",
  Text: "#333333",
  Brand: "#000000",
  Border: "#EAEAEA",
  Muted: "#666666",
};

// --- Layout ---
export function wrapEmail(
  contentHtml: string,
  title: string = "Vayva Notification",
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0; padding:0; background-color:${Colors.Background}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${Colors.Text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; margin: 0 auto; background: #ffffff;">
          
          <!-- Minimalist Header with Text Logo -->
          <tr>
            <td style="padding: 0 0 32px; text-align: left;">
              <div style="font-family: 'Inter', sans-serif; font-weight: 700; font-size: 24px; letter-spacing: -0.5px; color: #000000;">
                Vayva
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0; font-size: 16px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Minimalist Footer -->
          <tr>
            <td style="padding-top: 48px; border-top: 1px solid ${Colors.Border}; margin-top: 48px; text-align: left; opacity: 0.8;">
              <p style="margin: 0; font-size: 12px; color: ${Colors.Muted}; line-height: 1.5;">
                © ${new Date().getFullYear()} Vayva.<br>
                Lagos, Nigeria.
              </p>
              <div style="margin-top: 12px; font-size: 12px;">
                <a href="${BRAND.canonicalOrigin}/privacy" style="color: ${Colors.Muted}; text-decoration: none; margin-right: 12px;">Privacy</a>
                <a href="${BRAND.canonicalOrigin}/terms" style="color: ${Colors.Muted}; text-decoration: none;">Terms</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}

// --- Components ---

export function Hero(type: string): string {
  // We skip complex hero images for the minimalist text-first design
  // unless strictly necessary. For now, we return empty or a simple spacer.
  return `<div style="margin-bottom: 24px;"></div>`;
}

export function Button(url: string, label: string): string {
  return `
    <a 
        href="${url}"
        style="
            display: inline-block;
            background: #000000;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 9999px; /* Pill shape */
            font-size: 14px;
            font-weight: 600;
            margin-top: 24px;
            margin-bottom: 24px;
            text-align: center;
        "
    >
        ${label}
    </a>
    `;
}

export function Badge(
  text: string,
  color: "success" | "warning" | "error" | "info" = "info",
): string {
  const map = {
    success: { bg: "#F0FDF4", text: "#15803D" },
    warning: { bg: "#FFFBEB", text: "#B45309" },
    error: { bg: "#FEF2F2", text: "#B91C1C" },
    info: { bg: "#EFF6FF", text: "#1D4ED8" },
  };
  const c = map[color];

  return `
    <span style="
        display: inline-block;
        background: ${c.bg};
        color: ${c.text};
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    ">${text}</span>
  `;
}

export function Text(
  content: string,
  type: "h1" | "h2" | "h3" | "body" | "small" = "body",
  align: "left" | "center" = "left",
): string {
  let styleStr = `text-align: ${align}; margin: 0 0 16px; color: ${Colors.Text};`;

  if (type === "h1") {
    styleStr += "font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 24px; color: #000000;";
  } else if (type === "h2") {
    styleStr += "font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #000000;";
  } else if (type === "h3") {
    styleStr += "font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #000000;";
  } else if (type === "small") {
    styleStr += `font-size: 13px; color: ${Colors.Muted};`;
  } else {
    styleStr += "font-size: 16px; line-height: 1.6;";
  }

  return `<div style="${styleStr}">${content}</div>`;
}

export function KeyValue(label: string, value: string): string {
  return `
    <div style="padding: 12px 0; border-bottom: 1px solid ${Colors.Border}; display: flex; justify-content: space-between;">
        <span style="color: ${Colors.Muted}; font-size: 14px;">${label}</span>
        <span style="color: #000000; font-weight: 500; font-size: 14px; float: right;">${value}</span>
        <div style="clear: both;"></div>
    </div>
    `;
}
