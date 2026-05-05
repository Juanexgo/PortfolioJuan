import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readJson, writeJson } from "@/lib/fs-utils";
import { Message } from "@/types/message";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = "canulpasosjuanjose@gmail.com";

export async function POST(request: Request) {
  const { name, email, message: content } = await request.json();

  if (!name || !email || !content) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New contact message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Portfolio Contact</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin-top: 8px;">
            ${content.replace(/\n/g, "<br>")}
          </div>
          <p style="color: #a0a0b0; font-size: 12px; margin-top: 24px;">
            Sent from your portfolio website
          </p>
        </div>
      `,
      replyTo: email,
    });

    const messages = readJson<Message[]>("messages.json");
    const newMessage: Message = {
      id: Date.now().toString(),
      name,
      email,
      message: content,
      createdAt: new Date().toISOString(),
      read: false,
    };
    messages.unshift(newMessage);
    writeJson("messages.json", messages);

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
