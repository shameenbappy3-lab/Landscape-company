import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, service, property, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'ProClean Lead <onboarding@resend.dev>', 
      to: ['shameenbappy3@gmail.com'], // The client's email
      subject: `New Estimate Request: ${name}`,
      html: `
        <h2>New Lead Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Property:</strong> ${property}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}