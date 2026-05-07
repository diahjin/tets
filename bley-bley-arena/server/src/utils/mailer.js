import nodemailer from 'nodemailer';

export async function sendResetEmail(to, resetUrl) {
  if (!process.env.SMTP_HOST) {
    console.log('[DEV RESET URL]', resetUrl);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Recupera tu contraseña - Bley Bley Arena',
    html: `<p>Usa este enlace para recuperar tu contraseña:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Caduca en 30 minutos.</p>`
  });
}
