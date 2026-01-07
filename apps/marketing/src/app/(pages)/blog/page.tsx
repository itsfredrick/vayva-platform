import React from "react";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Vayva Blog | Strategies for Nigerian Business Growth",
  description: "Real success stories, regulatory updates (CAC/FIRS), and WhatsApp sales tactics for Nigerian merchants.",
  openGraph: {
    title: "Vayva Blog | Strategies for Nigerian Business Growth",
    description: "Real success stories, regulatory updates (CAC/FIRS), and WhatsApp sales tactics for Nigerian merchants.",
    type: "website",
    images: [
      {
        url: "/images/blog/blog-feature-ai.png",
        width: 1200,
        height: 630,
        alt: "Vayva Blog",
      },
    ],
  },
};

export default function BlogPage() {
  return <BlogClient metadata={metadata} />;
}
