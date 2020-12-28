const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ /*region: 'us-east-2'*/ });

exports.handler = async (event, context, callback) => {
    
    //1. Extract the query parameters & validate
    var body =  JSON.parse(event.body);
    console.log('Body:', body);
    if (body !== null && body !== undefined) {
        if (!(body.NotificationID && body.NotificationBody && body.NotificationEmail)) 
        {
            return {
              statusCode: 400,
              body: JSON.stringify({message: 'Required data was missing', error:null})
            };
        }
        else
        {
            console.log('All required data was supplied');
        }
    }
    
    
    var params = {
        TableName: "Notification",
        Item: {
            'NotificationID' : body.NotificationID,
            'NotificationBody': body.NotificationBody,
            'NotificationEmail' : body.NotificationEmail,
            'UpdatedAt': Math.round((new Date()).getTime() / 1000)
        }
    };
    
    var response;
    
    
    try {
        const writeOperation = await documentClient.put(params).promise();

        return response = {
          statusCode: 200,
          body: JSON.stringify({ message: 'Notification added sucessfully!' })
        };

        // const writeOperation = await documentClient.put(params,function (err, data) {
        //   if (!err) {
        //       console.log("Operation succeeded:", JSON.stringify(data, null, 2));
        //       return response = {
        //         statusCode: 200,
        //         body: JSON.stringify({ message: 'Notification added sucessfully' })
        //       };
              
        //   } else {
        //     console.error("Operation failure::", JSON.stringify(err, null, 2));
        //     return response = {
        //       statusCode: 400,
        //       body: JSON.stringify({ message: 'Oops ! something went wrong here!' })
        //     };
          
        //   }
        // }).promise();
     
      
    } catch (e) {
      console.log(e.message);
      
      return {
          statusCode: 400,
          body: JSON.stringify({message: 'Oops ! something went wrong here!', error:e})
      };
    }
    
};
