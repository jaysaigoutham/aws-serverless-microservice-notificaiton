const AWS = require('aws-sdk');
const SES = new AWS.SES({ /*region: 'us-east-2'*/ });

exports.handler = async (event, context) => {
    
    console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    });

  const to = 'jayasai.kliq@gmail.com';
  const from = 'taest@test.com';
  const reply_to = 'jayasai.kliq@gmail.com';
  const subject = 'test';
 
  const fromBase64 = Buffer.from(from).toString('base64');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body><h1>Hello world!</h1></body>
    </html>
  `;

  const sesParams = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    //ReplyToAddresses: [replyTo],
    Source: 'jayasai.kliq@gmail.com',
  };
  const response = await SES.sendEmail(sesParams).promise();
  console.log(response);
  
};
