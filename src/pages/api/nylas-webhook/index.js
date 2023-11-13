import connectDB from "@lib/db";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      // Handle the POST request
      console.log('==========BODY DELTAS START==========');
      console.log(req.body);
      if (req.body.deltas[0].metadata) {
        for (const key in req.body.deltas[0].metadata) {
          console.log(key + ": " + req.body.deltas[0].metadata[key]);
        }
      }
      console.log('==========BODY DELTAS START==========\n');

      // Add your specific logic for handling POST requests
      // ...

      // Respond with a 200 status
      return res.status(200).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      // Handle the GET request
      if (req.query.challenge) {
        console.log(`Received challenge code! - ${req.query.challenge}`);
        // Respond with the challenge code
        return res.send(req.query.challenge);
      }

      // Add your specific logic for handling GET requests
      // ...

      // Respond with a 200 status
      return res.status(200).json({ message: "GET request handled successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Handle the DELETE request
      // Add your specific logic for handling DELETE requests
      // ...

      // Respond with a 204 status
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Respond with a 400 status for invalid requests
  return res.status(400).json({ error: "Invalid request" });
};
