import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

const templates = {
  newUser: 'd-5c1e87d5d7104c4483e39000eb62f6ef',
};

const sendMail = async (type, email, name, data) => {
  dotenv.config();
  const { SENDGRID_KEY } = process.env;
  sgMail.setApiKey(SENDGRID_KEY);

  const msg = {
    to: email,
    from: 'GDSA Hub <gdsa@digitalrepublic.ng>',
    subject: 'Welcome to GDSA Hub',
    templateId: templates[type],
    dynamic_template_data: {
      ...data,
      name,
    },
  };

  await sgMail.send(msg);
};

export default sendMail;
