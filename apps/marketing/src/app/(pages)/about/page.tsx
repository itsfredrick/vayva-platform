
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { APP_URL } from "@/lib/constants";
import { ArrowLeft, Linkedin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Helper */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Text */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              We built this because we know what it's like to hustle.
            </h1>
            <p className="text-xl text-[#64748B] leading-relaxed">
              Vayva isn't just software. It's the answer to a question every Nigerian entrepreneur asks: "How can I make money without working myself to death?"
            </p>
          </div>

          {/* CEO Story Section */}
          <div className="grid md:grid-cols-12 gap-12 items-start">

            {/* Image Column */}
            <div className="md:col-span-5">
              <div className="sticky top-8">
                <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-[4/5] relative mb-6 border border-gray-200 shadow-lg">
                  <Image
                    src="/images/nyamsi-fredrick.jpg"
                    alt="Nyamsi Fredrick"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Fallback pattern if image is missing is handled by bg-gray-100, simplistic approach */}
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-[#0F172A]">Nyamsi Fredrick</h3>
                  <p className="text-[#64748B] text-sm mb-4">Founder & CEO</p>

                  <a
                    href="https://www.linkedin.com/in/nyamsi-fredrick-1b5b40290"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 rounded-xl font-medium transition-colors gap-2"
                  >
                    <Linkedin size={18} />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Story Text Column */}
            <div className="md:col-span-7 space-y-8 text-lg text-[#334155] leading-relaxed">
              <p>
                <span className="font-bold text-[#0F172A] text-2xl block mb-2">It started with two jobs.</span>
                Nyamsi Fredrick saw it everywhere. Friends, family, neighbors — everyone was working a standard 9-5 job, but it wasn't enough. The salary barely covered rent and feeding, let alone "maintenance."
              </p>

              <p>
                So, they took on side hustles. Selling clothes, electronics, food items on WhatsApp. But instead of freedom, they got stress.
              </p>

              <blockquote className="border-l-4 border-[#22C55E] pl-6 py-2 italic text-[#0F172A] bg-green-50/50 rounded-r-lg my-8">
                "You close from your main job, tired. You check your phone, and it's 50 messages. People asking prices, negotiating, complaining. You spend your 'resting time' working again. That is not life."
              </blockquote>

              <p>
                Nyamsi realized that the problem wasn't the willingness to work; it was the mechanism. People needed a way to set up a business that could run itself. A "Business in a Box."
              </p>

              <p>
                <strong className="text-[#0F172A]">Vayva was born from this idea.</strong>
              </p>

              <p>
                He wanted to build a system where you could set up your account once, load your products, and then... simply check up on it. A system that answers the customers, records the sales, and keeps the money safe while you focus on your main job (or just rest).
              </p>

              <p>
                Today, Vayva helps thousands of Nigerians stop trading their mental health for extra income. We handle the emotions, the logistics, and the details. You just handle the profits.
              </p>

              <div className="pt-8">
                <Link href={`${APP_URL}/signup`}>
                  <Button className="bg-[#0F172A] text-white px-8 py-4 text-lg rounded-xl hover:bg-black w-full md:w-auto">
                    Build your own automated business
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEO/Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Person",
              "name": "Nyamsi Fredrick",
              "jobTitle": "Founder & CEO",
              "image": "https://vayva.ng/images/nyamsi-fredrick.jpg",
              "url": "https://www.linkedin.com/in/nyamsi-fredrick-1b5b40290",
              "description": "Founder of Vayva, helping Nigerians automate their side hustles."
            }
          })
        }}
      />
    </div>
  );
}
