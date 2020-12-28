const AWS = require('aws-sdk');
const SES = new AWS.SES({ /*region: 'us-east-2'*/ });

const sample_verified_email = 'jayasai.kliq@gmail.com'; //will be used for demo purpose since SNS & SES only allows verified emails in sandbox

exports.handler = async (event, context) => {
    
    console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    });

  if(event.Records.lengh == 0)
  {
    console.error("ERROR : No records found");
    return;
  }

  var record = event.Records[0];
  console.log("record : "+ JSON.stringify(record));
  console.log("record Email : "+ JSON.stringify(record.dynamodb.NewImage.NotificationEmail.S));
  console.log("record Body: "+ JSON.stringify(record.dynamodb.NewImage.NotificationBody.S));

  const to = record.dynamodb.NewImage.NotificationEmail.S; //FYI : only verififed emails work in sandbox env
  const from = record.dynamodb.NewImage.NotificationEmail.S; //FYI : only verififed emails work in sandbox env
  const reply_to = record.dynamodb.NewImage.NotificationEmail.S; //FYI : only verififed emails work in sandbox env
  const subject = record.dynamodb.NewImage.NotificationBody.S;
 
  //const fromBase64 = Buffer.from(from).toString('base64');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>Greetings from Fake Uber !</head>
      <body>
        <h1>New notificaiton from your Fake Uber platfrom!</h1>
        <h2>` + subject +`</h2>
      </body>
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
    Source: to,
  };
  const response = await SES.sendEmail(sesParams).promise();
  console.log(response);
  
};
