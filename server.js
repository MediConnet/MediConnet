import 'dotenv/config';
import { Resend } from 'resend';

const API_KEY = process.env.RESEND_API_KEY;

if (!API_KEY) {
  console.error('Set RESEND_API_KEY in .env or environment');
  process.exit(1);
}

const resend = new Resend(API_KEY);

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>', 
    to: ['kevincata2005@gmail.com'],
    subject: 'Hello World  prueba 2  ghhfghfghgfh' ,
    html: '<strong>It works!</strong>',
  });

  if (error) {
    console.error({ error }); 
    process.exit(1);
  }

  console.log({ data }); 
})();
