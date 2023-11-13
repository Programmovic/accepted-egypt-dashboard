import connectDB from "@lib/db";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      // Handle the incoming webhook payload from Nylas
      console.log('Received Nylas webhook:', req.body);

      // Add your logic to process the Nylas webhook data
      // ...

      return res.status(200).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      // Add your logic for handling GET requests
      // ...

      return res.status(200).json({ message: "GET request handled successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Add your logic for handling DELETE requests
      // ...

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
