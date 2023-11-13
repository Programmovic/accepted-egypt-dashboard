import { Nylas, WebhookTriggers, Scope } from 'nylas';
import connectDB from '../../../lib/db'; // Adjust the path accordingly

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { body } = req;

      // Configure Nylas SDK with client credentials
      Nylas.config({
        clientId: process.env.NYLAS_CLIENT_ID,
        clientSecret: process.env.NYLAS_CLIENT_SECRET,
        apiServer: process.env.NYLAS_API_SERVER,
      });

      // Register frontend as a redirect URI
      const CLIENT_URI =
        process.env.CLIENT_URI || `http://localhost:${process.env.PORT || 3000}`;
      const applicationDetails = await Nylas.application({
        redirectUris: [CLIENT_URI],
      });
      console.log('Application registered. Application Details:', JSON.stringify(applicationDetails));

      // Start Nylas webhook
      const webhookDetails = await Nylas.openWebhookTunnel({
        onMessage: function handleEvent(delta) {
          switch (delta.type) {
            case WebhookTriggers.AccountConnected:
              console.log(
                'Webhook trigger received, account connected. Details:',
                JSON.stringify(delta.objectData, undefined, 2)
              );
              break;
          }
        },
      });
      console.log('Webhook tunnel registered. Webhook ID: ' + webhookDetails.id);

      // Build URL for authenticating users
      const authUrl = Nylas.urlForAuthentication({
        loginHint: body.email_address,
        redirectURI: (CLIENT_URI || '') + body.success_url,
        scopes: [Scope.Calendar],
      });

      return res.send(authUrl);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST' && req.url === '/exchange-mailbox-token') {
    try {
      const { body } = req;

      // Exchange authorization code for an access token
      const { accessToken, emailAddress } = await Nylas.exchangeCodeForToken(
        body.token
      );

      // Normally store the access token in the DB
      console.log('Access Token was generated for: ' + emailAddress);

      // Replace this mock code with your actual database operations
      // Ensure that you have the necessary logic to create/update users in your database
      // const user = await mockDb.createOrUpdateUser(emailAddress, {
      //   accessToken,
      //   emailAddress,
      // });

      // Return an authorization object to the user
      return res.json({
        id: 'user.id', // Replace with the actual user ID from your database
        emailAddress: emailAddress,
        accessToken: accessToken, // This is only for demo purposes - do not send access tokens to the client in production
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid request' });
  }
}
