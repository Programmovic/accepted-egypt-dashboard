// components/OnlineAdmins.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const OnlineAdmins = () => {
  const [onlineAdmins, setOnlineAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineAdmins = async () => {
      try {
        const res = await axios.get('/api/user'); // Adjust the endpoint if necessary
        setOnlineAdmins(res.data); // Assuming the API returns an array of online admins
      } catch (error) {
        console.error('Error fetching online admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineAdmins();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  // Sort admins to show online ones first
  const sortedAdmins = onlineAdmins.sort((a, b) => {
    return (b.isOnline === true) - (a.isOnline === true);
  });

  return (
    <div className="d-flex align-items-center flex-wrap"> {/* Flex container */}
      {sortedAdmins.map(admin => (
        <div key={admin.id} className="d-flex align-items-center me-2"> {/* Add spacing between circles */}
          <div
            className="admin-circle"
            style={{
              backgroundColor: admin.isOnline ? 'green' : 'gray', // Online/Offline color
              color: 'white',
              borderRadius: '50%', // Make it circular
              width: '50px', // Circle diameter
              height: '50px', // Circle diameter
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '-20px', // Space between the circle and text
              border: '1px solid white'
            }}
            title={admin.username}
          >
            {admin.username[0].toUpperCase()} {/* Display the first character */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnlineAdmins;
