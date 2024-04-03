import { Button, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import { AccountCircle, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

type ItemWithIconProps = {
  icon: React.ReactNode;
} & PropsWithChildren;

const ItemWithIcon = (props: ItemWithIconProps) => {
  const { icon, children } = props;

  return (
    <>
      {icon}
      {children}
    </>
  );
}

export default function HeaderProfileNav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await axios.post('/api/user/logout');
      if (res.status === 200) {
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get('client_token');

    if (!token) {
      // If the user is not signed in, redirect to the login page
      router.push('/login');
      return;
    }

    try {
      // Decode the token to access the username and user role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUsername(decodedToken.username);
      setUserRole(decodedToken.role)
    } catch (error) {
      console.error('Error decoding token:', error);
    } finally {
      // Set loading to false after retrieving the username and user role
      setLoading(false);
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleMenuOpen}
        startIcon={<Avatar>{username && username[0].toUpperCase()}</Avatar>}
        endIcon={<ExpandMoreIcon />}
        color="inherit"
        size="large"
      >
        {username} - {userRole}
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
      >
        <MenuItem onClick={logout}>
          <Typography variant="body1">Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
