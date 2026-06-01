'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Navigation } from '@/types';

interface Props {
  navigation: Navigation | null;
}

function cslp(uid: string | undefined, field: string): Record<string, string> {
  if (!uid) return {};
  return { 'data-cslp': `navigation.${uid}.en-us.${field}` };
}

export default function Header({ navigation }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const uid = navigation?.uid;
  const navItems = navigation?.nav_items ?? [];
  const utilityLinks = navigation?.utility_links ?? [];
  const logo = navigation?.logo;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex-shrink-0" {...cslp(uid, 'logo')}>
            {logo?.url ? (
              <Image
                src={logo.url}
                alt={logo.title ?? 'Logo'}
                height={40}
                width={120}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <span className="text-white font-bold text-2xl tracking-wider">CITCO</span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.url}
                className="px-4 py-2 text-sm text-white/80 hover:text-white font-medium transition-colors"
                {...cslp(uid, `nav_items.${i}.label`)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {utilityLinks.length > 0 && (
            <div className="hidden lg:flex items-center gap-4">
              {utilityLinks.map((link, i) =>
                i === utilityLinks.length - 1 ? (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="px-5 py-2 bg-[#005B30] text-white text-sm font-semibold hover:bg-[#007A42] transition-colors"
                    {...cslp(uid, `utility_links.${i}.label`)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="text-sm text-white/80 hover:text-white font-medium transition-colors"
                    {...cslp(uid, `utility_links.${i}.label`)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0A1628] border-t border-white/10 px-6 py-4">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.url}
              className="block py-3 text-white/80 hover:text-white text-sm font-medium border-b border-white/10 last:border-0"
              onClick={() => setMobileOpen(false)}
              {...cslp(uid, `nav_items.${i}.label`)}
            >
              {item.label}
            </Link>
          ))}
          {utilityLinks.length > 0 && (
            <div className="pt-4 flex flex-col gap-3">
              {utilityLinks.map((link, i) =>
                i === utilityLinks.length - 1 ? (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="inline-block px-5 py-2 bg-[#005B30] text-white text-sm font-semibold text-center"
                    onClick={() => setMobileOpen(false)}
                    {...cslp(uid, `utility_links.${i}.label`)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="text-sm text-white/80 font-medium"
                    onClick={() => setMobileOpen(false)}
                    {...cslp(uid, `utility_links.${i}.label`)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
