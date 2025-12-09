# Email Configuration Guide

This guide explains how to configure email notifications for the contact form.

## Environment Variables

Add the following variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_SECURE=false
SMTP_DEFAULT_FROM=noreply@bureauofwonders.com
SMTP_DEFAULT_REPLY_TO=info@bureauofwonders.com

# Contact Form Recipient
CONTACT_FORM_RECIPIENT=contact@bureauofwonders.com
```

## Common SMTP Providers

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
```

**Note:** For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_SECURE=false
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
SMTP_SECURE=false
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
SMTP_SECURE=false
```

## Testing Email Configuration

### Using Development Mode

For development, you can use a service like [Mailtrap](https://mailtrap.io/) or [Ethereal Email](https://ethereal.email/) to test emails without sending real emails:

```env
# Mailtrap Example
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
SMTP_SECURE=false
```

### Testing the Contact Form

1. Start your Strapi server: `npm run develop`
2. Submit a test contact form from your frontend
3. Check your email inbox (or Mailtrap inbox) for the notification

## Email Template

The contact form sends an email with the following information:

- **Subject:** "New Contact Inquiry from [Name]"
- **From:** Value from `SMTP_DEFAULT_FROM`
- **Reply-To:** The email address submitted in the form
- **To:** Value from `CONTACT_FORM_RECIPIENT`

The email includes:
- Name
- Company (if provided)
- Email address
- Message
- Submission timestamp

## Troubleshooting

### Email not sending

1. **Check environment variables:** Ensure all SMTP variables are set correctly in `.env`
2. **Check Strapi logs:** Look for error messages in the console
3. **Verify SMTP credentials:** Test your SMTP credentials with a tool like [SMTP Test Tool](https://www.smtper.net/)
4. **Check firewall:** Ensure your server can connect to the SMTP host on the specified port
5. **Check spam folder:** The email might be in the spam folder

### Common Errors

**"Invalid login"**
- Verify your SMTP username and password
- For Gmail, ensure you're using an App Password

**"Connection timeout"**
- Check if the SMTP port is correct
- Verify firewall settings

**"Self-signed certificate"**
- Set `SMTP_SECURE=false` for port 587
- Set `SMTP_SECURE=true` for port 465

## Production Recommendations

For production, we recommend using a dedicated email service provider:

1. **SendGrid** - Reliable with good free tier
2. **Mailgun** - Great for transactional emails
3. **AWS SES** - Cost-effective for high volume
4. **Postmark** - Excellent deliverability

These services provide better deliverability, analytics, and support compared to using a personal email account.
