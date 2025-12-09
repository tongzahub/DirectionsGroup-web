/**
 * contact-inquiry controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-inquiry.contact-inquiry', ({ strapi }) => ({
  async create(ctx) {
    // Set submittedAt to current timestamp
    ctx.request.body.data = {
      ...ctx.request.body.data,
      submittedAt: new Date().toISOString(),
      status: 'New'
    };

    const response = await super.create(ctx);

    // Send email notification
    try {
      const { name, company, email, message } = ctx.request.body.data;
      const recipientEmail = process.env.CONTACT_FORM_RECIPIENT || 'contact@bureauofwonders.com';

      await strapi.plugins['email'].services.email.send({
        to: recipientEmail,
        from: process.env.SMTP_DEFAULT_FROM || 'noreply@bureauofwonders.com',
        replyTo: email,
        subject: `New Contact Inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Company: ${company || 'Not provided'}
Email: ${email}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
        `,
      });

      strapi.log.info(`Contact form email sent successfully to ${recipientEmail}`);
    } catch (error) {
      // Log error but don't fail the request - inquiry is already saved
      strapi.log.error('Failed to send contact form email:', error);
    }

    return response;
  }
}));
