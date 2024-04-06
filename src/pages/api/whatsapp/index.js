// pages/api/sendSms.js

import https from 'https';

export default function handler(req, res) {
  // Extract the phone number from the request query parameters
  const { to } = req.query;

  // Check if the 'to' parameter is provided in the request
  if (!to) {
    return res.status(400).json({ success: false, error: "Phone number 'to' is required" });
  }

  // Construct the message data
  const postData = JSON.stringify({
    "messages": [
      {
        "destinations": [{"to": to}], // Use the provided 'to' phone number
        "from": "Accepted EG",
        "text": "Hello,\n\nThis is a test message from ACCEPTED. Have a nice day!"
      }
    ]
  });

  // Configure the HTTP request options
  const options = {
    method: 'POST',
    hostname: '6g26le.api.infobip.com',
    path: '/sms/2/text/advanced',
    headers: {
      'Authorization': 'App e77d8995ad721aa1cc3cb7f3657733d2-4179fe68-ab45-4b38-b917-89b839356db9',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    maxRedirects: 20
  };

  // Send the HTTP request to Infobip
  const reqInfobip = https.request(options, function (resInfobip) {
    var chunks = [];

    resInfobip.on("data", function (chunk) {
      chunks.push(chunk);
    });

    resInfobip.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
      res.status(200).json({ success: true });
    });

    resInfobip.on("error", function (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    });
  });

  reqInfobip.on('error', function (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  });

  // Write the message data to the request body and end the request
  reqInfobip.write(postData);
  reqInfobip.end();
}
