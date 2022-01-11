// https://www.youtube.com/watch?v=-rcRf7yswfM&ab_channel=yoursTRULY
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = '52731969862-6sbq7g3osg08tar8vn5oprscsrsst6t1.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04igsH8BLhVazCgYIARAAGAQSNwF-L9IrQLLmNL8UbiLAY8EY6bAucbWGWExyaJcPzD2X8Aqf9xrSZWG9ClrhI1Pnhj_fEzCrF6I';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMoreThan50PercentNotHappyMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'anurag.ap6@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      // from: 'SENDER NAME <yours authorised email address@gmail.com>',
      from: 'Anurag <anurag.ap6@gmail.com>',
      to: 'anurag.ap6@gmail.com',
      subject: 'Employee Sentiment API',
      text: "Hi,\nMore than 50% employees are likely not happy today.",
      html: '<h2>Hi,<br></h2> \
              <h2>More than 50% employees are likely not happy today.<br></h2> \
              <h3> Please visit <a href="http://www.xyz.com"> for more information.</h3>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

// sendMoreThan50PercentNotHappyMail()
//   .then((result) => console.log('Email sent...', result))
//   .catch((error) => console.log(error.message));

  module.exports = sendMoreThan50PercentNotHappyMail;