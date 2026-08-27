'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SYSTEM_LINKS = [
  {
    href: '/control-center',
    label: 'Control',
    key: 'control-center',
    contract: (
      <Link href="/control-center" data-global-nav-system-key="control-center">
        Control
      </Link>
    ),
  },
  {
    href: '/operator',
    label: 'Operator',
    key: 'operator',
    contract: (
      <Link href="/operator" data-global-nav-system-key="operator">
        Operator
      </Link>
    ),
  },
  {
    href: '/mission-control',
    label: 'Mission',
    key: 'mission-control',
    contract: (
      <Link href="/mission-control" data-global-nav-system-key="mission-control">
        Mission
      </Link>
    ),
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    key: 'dashboard',
    contract: (
      <Link href="/creator/dashboard" data-global-nav-system-key="dashboard">
        Dashboard
      </Link>
    ),
  },
  {
    href: '/system',
    label: 'System',
    key: 'system',
    contract: (
      <Link href="/system" data-global-nav-system-key="system">
        System
      </Link>
    ),
  },
  {
    href: '/launch',
    label: 'Launch',
    key: 'launch',
    contract: (
      <Link href="/launch" data-global-nav-system-key="launch">
        Launch
      </Link>
    ),
  },
  {
    href: '/status',
    label: 'Status',
    key: 'status',
    contract: (
      <Link href="/status" data-global-nav-system-key="status">
        Status
      </Link>
    ),
  },
  {
    href: '/progress',
    label: 'Progress',
    key: 'progress',
    contract: (
      <Link href="/progress" data-global-nav-system-key="progress">
        Progress
      </Link>
    ),
  },
];

const PORTAL_LINKS = [
  { href: '/fyp', label: 'For You', key: 'fyp' },
  { href: '/gmar', label: 'GMAR', key: 'gmar' },
  { href: '/nexa', label: 'NEXA', key: 'nexa' },
  { href: '/cineverse', label: 'CineVerse', key: 'cineverse' },
  { href: '/live', label: 'Live', key: 'live' },
  { href: '/wallet', label: 'Wallet', key: 'wallet' },
  { href: '/profile', label: 'Profile', key: 'profile' },
];

const NAV_ROOT_STYLE: React.CSSProperties = {
  width: '100%',
  borderBottom: '1px solid rgba(255,255,255,0.10)',
  padding: '12px 20px',
  position: 'sticky',
  top: 0,
  backdropFilter: 'blur(10px)',
  zIndex: 2147483000,
  isolation: 'isolate',
  pointerEvents: 'auto',
};

const NAV_INNER_STYLE: React.CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
  pointerEvents: 'auto',
};

const HOME_LINK_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  pointerEvents: 'auto',
  cursor: 'pointer',
  touchAction: 'manipulation',
  textDecoration: 'none',
  fontWeight: 800,
};

const NAV_LINK_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  pointerEvents: 'auto',
  cursor: 'pointer',
  touchAction: 'manipulation',
  textDecoration: 'none',
  padding: '8px 12px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.10)',
};

export default function GlobalPortalNav() {
  const pathname = usePathname();

  if (pathname === '/fyp' || pathname?.startsWith('/fyp/')) {
    return null;
  }

  return (
    <nav aria-label="Global portal navigation" style={NAV_ROOT_STYLE}>
      <div style={NAV_INNER_STYLE}>
        <Link href="/" style={HOME_LINK_STYLE}>
          Lumora
        </Link>

        {SYSTEM_LINKS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            data-global-nav-system-key={item.key}
            style={NAV_LINK_STYLE}
          >
            {item.label}
          </Link>
        ))}

        {PORTAL_LINKS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            data-global-nav-key={item.key}
            style={NAV_LINK_STYLE}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
