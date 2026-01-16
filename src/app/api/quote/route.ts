import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            suburb,
            products,
            windowCount,
            referral,
            referrerName,
            message,
        } = body;

        // 1. Create a Transporter
        // Note: You must configure these env vars in .env.local
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 2. Format the Email Content
        const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1c1917; border-bottom: 2px solid #e6d5c3; padding-bottom: 10px;">New Quote Request</h2>
        
        <div style="background-color: #f5f5f4; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #44403c;">Contact Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Suburb:</strong> ${suburb}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #44403c;">Project Details</h3>
          <p><strong>Products Interested:</strong> ${products.join(', ') || 'None selected'}</p>
          <p><strong>Number of Windows/Doors:</strong> ${windowCount || 'N/A'}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #44403c;">Referral & Message</h3>
          <p><strong>Found via:</strong> ${referral} ${referrerName ? `(${referrerName})` : ''}</p>
          <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 12px; border-radius: 4px;">
            <p style="margin: 0; color: #57534e;">${message || 'No additional message provided.'}</p>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #a8a29e; margin-top: 30px; text-align: center;">
          Sent from Modern Curtains Website
        </p>
      </div>
    `;

        // 3. Send Email
        // If no env vars are set, we just log it in dev
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log("Mock Email Sent:", htmlContent);
            return NextResponse.json({ message: "Mock email processed (Env vars missing)" }, { status: 200 });
        }

        await transporter.sendMail({
            from: `"MCB Website" <${process.env.SMTP_USER}>`, // sender address
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // list of receivers (default to sender if admin not set)
            subject: `New Quote: ${firstName} ${lastName} (${suburb})`, // Subject line
            html: htmlContent,
        });

        return NextResponse.json({ message: "Quote sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
