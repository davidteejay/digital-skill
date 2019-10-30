import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

const templates = {
  newUser: 'd-5c1e87d5d7104c4483e39000eb62f6ef',
  flagReport: 'd-35bf3e4949dc43e9b67601e10be45458',
  passwordReset: 'd-8164a353255a47658c7339e09c360c40',
  reportSession: 'd-6ad5bc5d7e594da0a4c5d386bc19cf69',
  supportClient: 'd-92150d16443745709b20c516d99d9e0a',
  supportAdmin: 'd-b4d355831ddb483388f517c68b032330',
  assignedSessionDelay: 'd-d10f779ef22049739259c17472eeffdf'  
};

const sendMail = async (type, email, name, data) => {
  dotenv.config();
  const { SENDGRID_KEY } = process.env;
  sgMail.setApiKey(SENDGRID_KEY);
  data["Sender_Name"] = "The GDSA Hub"
  data["Sender_Address"] = "Google Digital Skills"
  data["Sender_City"] = "SSA "
  data["Sender_State"] = "Africa"

  const msg = {
    to: email,
    from: 'GDSA Hub <gdsa@digitalrepublic.ng>',
    subject: '',
    templateId: templates[type],
    dynamic_template_data: {
      ...data,
      name,
    },
  };
  await sgMail.send(msg);
};

export default sendMail;
