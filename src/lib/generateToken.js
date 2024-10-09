const crypto = require('crypto');

export const generateToken = () => {
  // Generate a random token using the crypto module
  return crypto.randomBytes(32).toString('hex'); // Generates a 64-character hex string
};
