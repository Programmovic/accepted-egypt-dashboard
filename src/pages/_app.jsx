import '@styles/globals.scss'
import { useEffect } from 'react'
import axios from 'axios'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { SSRProvider } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ProgressBar } from '@components/ProgressBar'

// Configure FontAwesome
config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Function to update finance information
    const updateFinance = async () => {
      try {
        // Make API call to update finance
        const response = await axios.put('/api/student/finance'); // Adjust URL and method as necessary
        console.log('Finance updated:', response.data);
      } catch (error) {
        console.error('Error updating finance:', error);
      }
    };

    // Call the updateFinance function when the app starts
    updateFinance();
  }, []);

  return (
    <SSRProvider>
      {/* Initialize and display ProgressBar */}
      <ProgressBar />
      {/* Render the rest of the application */}
      <Component {...pageProps} />
      {/* Toast notifications container */}
      <ToastContainer />
    </SSRProvider>
  )
}

export default MyApp
