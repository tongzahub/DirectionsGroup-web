export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        secure: env.bool('SMTP_SECURE', false),
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM', 'noreply@bureauofwonders.com'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO', 'info@bureauofwonders.com'),
      },
    },
  },
});
