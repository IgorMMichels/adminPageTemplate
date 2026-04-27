import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message } = await req.json();

    // Configure the SMTP transport
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST") || "mail.example.com",
      port: parseInt(Deno.env.get("SMTP_PORT") || "465"),
      secure: true,
      auth: {
        user: Deno.env.get("SMTP_USER") || "noreply@example.com",
        pass: Deno.env.get("SMTP_PASS") || "zkay7esk", // Fallback, but best to set it in env
      },
      tls: {
        // Do not fail on invalid certs if any
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
        from: Deno.env.get("SMTP_USER") || "noreply@example.com",
        to: "contact@example.com",
      replyTo: email,
      subject: `Novo Contato do Site: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0b2c5c;">Novo Contato via Site</h2>
          <p>Você recebeu uma nova mensagem através do formulário de contato do site.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0b2c5c;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, info }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
