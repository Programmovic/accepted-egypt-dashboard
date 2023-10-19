import {
  Badge, Dropdown, Nav, NavItem,
} from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCreditCard,
  faEnvelopeOpen,
  faFile,
  faMessage,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import { PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faGear, faListCheck, faLock, faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

type ItemWithIconProps = {
  icon: IconDefinition;
} & PropsWithChildren;

const ItemWithIcon = (props: ItemWithIconProps) => {
  const { icon, children } = props;

  return (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  );
}

export default function HeaderProfileNav() {
  const [username, setUsername] = useState('');
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
      // Decode the token to access the username
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUsername(decodedToken.username);
    } catch (error) {
      console.error('Error decoding token:', error);
    } finally {
      // Set loading to false after retrieving the username
      setLoading(false);
    }
  }, []);

  return (
    <Nav>
      <Dropdown as={NavItem}>
      <Dropdown.Toggle variant="link" bsPrefix="hide-caret" className="rounded-0" id="dropdown-profile">
          <div className="d-flex align-items-center justify-content-center">
            <div className="rounded-circle bg-black p-2 font-light" style={{ width: '40px', height: '40px' }}>
              <span className="text-decoration-none text-white">{username && username[0].toUpperCase()}</span>
            </div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="pt-0">
          <Dropdown.Header className="bg-light fw-bold rounded-top">{username}</Dropdown.Header>
          

          <Dropdown.Header className="bg-light fw-bold">Settings</Dropdown.Header>

          <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faUser}>Profile</ItemWithIcon>
            </Dropdown.Item>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faGear}>Settings</ItemWithIcon>
            </Dropdown.Item>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faCreditCard}>Payments</ItemWithIcon>
            </Dropdown.Item>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faFile}>Projects</ItemWithIcon>
            </Dropdown.Item>
          </Link>

          <Dropdown.Divider />

          <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faLock}>Lock Account</ItemWithIcon>
            </Dropdown.Item>
          </Link>
          <Dropdown.Item onClick={logout}>
            <ItemWithIcon icon={faPowerOff}>Logout</ItemWithIcon>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  )
}
