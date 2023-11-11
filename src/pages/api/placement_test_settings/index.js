import { google } from 'googleapis';
import connectDB from '@lib/db';
import PlacementTestSettings from '../../../models/placement_test_settings';
import Reservation from '../../../models/reservation';

export default async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    const test = req.body;

    try {
      // Create a new PlacementTestSettings document
      const newTest = new PlacementTestSettings(test);
      await newTest.save();

      // Create a corresponding reservation
      const testDate = new Date(newTest.date);
      const reservation = new Reservation({
        title: 'Placement Test',
        date: testDate,
        daysOfWeek: [testDate.toLocaleDateString('en-US', { weekday: 'long' })],
        startTime: '09:00 AM', // Adjust start and end times as needed
        endTime: '05:00 PM',
        room: newTest.room, // Assuming you have room information in the placement test
      });

      await reservation.save();

      // Schedule the reservation date to Google Calendar
      await scheduleToGoogleCalendar(reservation);

      return res.status(201).json({ newTest });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not create placement test and reservation' });
    }
  } else if (req.method === 'GET') {
    try {
      const allTests = await PlacementTestSettings.find();
      return res.status(200).json(allTests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not fetch placement tests' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid request' });
  }
};

async function scheduleToGoogleCalendar(reservation) {
  // Load client secrets from a file, or obtain them from the API Console.
  const credentials = require('./client_secret_646678969652-p3bgagkmr9edpdfnks4thei8duarc7vn.apps.googleusercontent.com.json');

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Set the token in your case it may be stored in the database or somewhere else
  const token = 'YOUR_TOKEN'; // Replace with your actual token

  oAuth2Client.setCredentials(token);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary: reservation.title,
    start: {
      dateTime: reservation.date.toISOString(),
      timeZone: 'YOUR_TIME_ZONE', // Replace with your actual time zone
    },
    end: {
      dateTime: reservation.endTime, // Replace with your actual end time
      timeZone: 'YOUR_TIME_ZONE', // Replace with your actual time zone
    },
    // Add other event details as needed
  };

  // Insert event to Google Calendar
  const calendarResponse = await calendar.events.insert({
    calendarId: 'primary', // Use 'primary' for the primary calendar of the authenticated user
    resource: event,
  });

  console.log('Event created: %s', calendarResponse.data.htmlLink);
}
