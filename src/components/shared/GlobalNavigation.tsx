'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function GlobalNavigation() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Hide global navigation on dashboard pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/employer') || pathname?.startsWith('/candidate')) {
    return null;
  }

  return (
    <header
      className="glass-panel"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            className="gradient-text"
            style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            CareerConnect
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/jobs" className="nav-link">
            Find Jobs
          </Link>
          <Link href="/employer" className="nav-link">
            For Employers
          </Link>
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!isHydrated ? null : isAuthenticated ? (
            <>
              <Link 
                href={user?.role === 'Admin' ? '/admin/dashboard' : user?.role === 'Employer' ? '/employer/dashboard' : '/candidate/dashboard'} 
                className="btn-outline" 
                style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => logout()} 
                className="btn-primary" 
                style={{ fontSize: "0.85rem", padding: "0.55rem 1.4rem" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}>
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.55rem 1.4rem" }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
