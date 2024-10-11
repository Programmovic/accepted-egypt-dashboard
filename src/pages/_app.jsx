import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@styles/globals.scss';
import { useEffect } from 'react';
import axios from 'axios';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SSRProvider } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProgressBar } from '@components/ProgressBar';
import {AuthProvider} from '../context/authProvider'

// Configure FontAwesome
config.autoAddCss = false;

// Create a custom MUI theme (if needed)
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Global scrollbar style (you can keep the CSS in globals.scss too)
        '::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#4caf50',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#388e3c',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '10px',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#4caf50 #f1f1f1',
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const updateLevelsCodes = async () => {
      try {
        const response = await axios.post(`/api/level/confirm_codes`);
      } catch (error) {
        // console.error("Error updating batch:", error);
        // toast.error("Failed to update the batch");
      }
    };
    const handleUpdateBatchesStatus = async () => {
      try {
        const response = await axios.post(`/api/batch/update_status`, {
          action: "updateBatchStatus",
        });
      } catch (error) {
        // console.error("Error updating batch:", error);
        // toast.error("Failed to update the batch");
      }
    };
    const updateFinance = async () => {
      try {
        const response = await axios.put('/api/student/finance'); // Adjust URL and method as necessary
        console.log('Finance updated:', response.data);
      } catch (error) {
        console.error('Error updating finance:', error);
      }
    };
    handleUpdateBatchesStatus()
    updateLevelsCodes()
    updateFinance();
  }, []);

  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <ProgressBar />
        <Component {...pageProps} />
        <ToastContainer />
      </SSRProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
