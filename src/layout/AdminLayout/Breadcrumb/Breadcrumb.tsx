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

  function isRouteExisting(path: string): boolean {
    return router.isFallback || router.pathname === path;
  }

  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      <BSBreadcrumb.Item
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
        active={pathSegments.length === 0}
      >
        Home
      </BSBreadcrumb.Item>
      {pathSegments.map((segment, index) => (
        <BSBreadcrumb.Item
          key={index}
          linkProps={{
            className: 'text-decoration-none',
            onClick: isRouteExisting('/' + pathSegments.slice(0, index + 1).join('/'))
              ? () => router.push('/' + pathSegments.slice(0, index + 1).join('/'))
              : undefined,
          }}
          active={index === pathSegments.length - 1}
        >
          {capitalizeWord(segment).replace('_', ' ')}
        </BSBreadcrumb.Item>
      ))}
    </BSBreadcrumb>
  );
}
