export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Clear the token cookie to log the user out
      res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not log out' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
