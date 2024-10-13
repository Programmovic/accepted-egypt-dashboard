import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Button, Container } from 'react-bootstrap'
import Breadcrumb from '@layout/AdminLayout/Breadcrumb/Breadcrumb'
import HeaderFeaturedNav from '@layout/AdminLayout/Header/HeaderFeaturedNav'
import HeaderNotificationNav from '@layout/AdminLayout/Header/HeaderNotificationNav'
import HeaderProfileNav from '@layout/AdminLayout/Header/HeaderProfileNav'
import OnlineAdmins from '../../../components/OnlineAdmins'
export default function Header(props) {
  const { toggleSidebar, toggleSidebarMd } = props

  return (
    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom radius-top-large">
      <Container fluid className="header-navbar d-flex align-items-center">
        <Button
          variant="link"
          className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none"
          type="button"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Button
          variant="link"
          className="header-toggler d-none d-md-inline-block px-md-0 me-md-3 rounded-0 shadow-none"
          type="button"
          onClick={toggleSidebarMd}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <OnlineAdmins /> 
        <Link href="/" className="header-brand d-md-none">
          <svg width="80" height="46">
            <title>CoreUI Logo</title>
            <use xlinkHref="/assets/img/393465684_707567994740060_449291053190160838_n.jpg" />
          </svg>
        </Link>
        {/* <div className="header-nav d-none d-md-flex">
          <HeaderFeaturedNav />
        </div>
        <div className="header-nav ms-auto">
          <HeaderNotificationNav />
        </div> */}
        {/* <div className="text-center">
  <p className='mb-0 bg-danger text-light p-2 px-4 rounded-3 fw-bold'>
    If any issue occurs during usage, even if it's minor, please stop using the system immediately and contact me right away to prevent further errors.
  </p>
</div> */}


        <div className="header-nav ms-auto">
          <HeaderProfileNav />
        </div>
        
      </Container>
      <div className="header-divider border-top my-2 mx-sm-n2" />
      <Container fluid>
        
        {/* <Breadcrumb /> */}
      </Container>
    </header>
  )
}
