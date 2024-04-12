// pages/api/sendPaymentReminder.js

import https from 'https';

export default function handler(req, res) {
  // Extract the phone number and payment details from the request body
  const { to, paymentAmount, dueDate } = req.body;

  // Check if the required parameters are provided in the request
  if (!to || !paymentAmount || !dueDate) {
    return res.status(400).json({ success: false, error: "Phone number, payment amount, and due date are required" });
  }

  // Construct the message data with payment reminder content
  const message = `Hello,\n\nThis is a friendly reminder that your payment of ${paymentAmount} is due on ${dueDate}. Please ensure timely payment. Thank you.`;

  const postData = JSON.stringify({
    "messages": [
      {
        "destinations": [{"to": to}], // Use the provided 'to' phone number
        "from": "ACCEPTED", // Update with your company name or identifier
        "text": message // Use the constructed payment reminder message
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
