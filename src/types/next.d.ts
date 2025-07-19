import { ReactNode } from 'react';

declare module 'next' {
  export interface PageProps {
    params: Promise<Record<string, string>>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
    children?: ReactNode;
  }
}