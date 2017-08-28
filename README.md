# lambda-mailer

An AWS Lambda function to send emails using Amazon SES. The original repository use templates from S3, but this one use the template on the directory 'templates'.

The primary purpose of this function is to provide a server-side back-end for sending emails
from static websites. By using AWS Lambda, we can eliminate the need to host your (almost) static website on
EC2 instances.

### Important parameters

- *email:* This parameter is required. It's used to populate the "Reply-To" field of the email.
- *name:* This parameter is optional, but when omitted, the value from `email` will be used.

### Example

Template File:

```
<p>
  Name: {{name}}<br />
  Email: {{email}}<br />
</p>
<p>{{message}}</p>
```

Input Parameters:

```
{
  "name": "John",
  "email": "john@example.com",
  "message": "This is my message"
}
```

## Credits

The following libraries are used:

* AWS SDK for NodeJS
* Markup.js - https://github.com/adammark/Markup.js/
