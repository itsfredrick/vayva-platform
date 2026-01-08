import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Contact API: Received submission", body);

        // NOTE: This is a stub for now as 'resend' package is not installed.
        // In production, uncomment the following block after installing 'resend'.

        /*
        if (process.env.RESEND_API_KEY) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          await resend.emails.send({
            from: "Vayva Support <support@vayva.shop>",
            to: ["hello@vayva.shop"],
            subject: `[Contact Form] ${body.subject}`,
            html: `
              <h1>New Contact Submission</h1>
              <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Subject:</strong> ${body.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${body.message}</p>
            `
          });
        }
        */

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({ success: true, message: "Message received" });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
