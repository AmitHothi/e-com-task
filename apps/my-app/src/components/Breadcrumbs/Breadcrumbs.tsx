'use client';

import React from 'react';
import Link from 'next/link';
import { BreadcrumbItem } from '../../../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav>
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.id < items.length - 1 ? (
            <Link href={item.link}>
              <a>{item.label}</a>
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

export default Breadcrumbs;
