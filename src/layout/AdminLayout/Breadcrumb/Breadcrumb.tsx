import { Breadcrumb as BSBreadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Breadcrumb() {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(Boolean);
  function capitalizeWord(word: string) {
    const firstLetter = word.charAt(0).toUpperCase();
      const rest = word.slice(1).toLowerCase();
  
      return firstLetter + rest;
  }
  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      <BSBreadcrumb.Item
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        Home
      </BSBreadcrumb.Item>
      {pathSegments.map((segment, index) => (
        <BSBreadcrumb.Item
          key={index}
          linkProps={{ className: 'text-decoration-none' }}
          href={'/' + pathSegments.slice(0, index + 1).join('/')}
          active={index === pathSegments.length - 1}
        >
          {capitalizeWord(segment).replace('_', ' ')}
        </BSBreadcrumb.Item>
      ))}
    </BSBreadcrumb>
  );
}


