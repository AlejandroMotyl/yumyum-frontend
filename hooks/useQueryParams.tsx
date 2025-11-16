'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = (key: string): string | null => {
    return searchParams.get(key);
  };

  const getAll = (): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.replace(url, { scroll: false });
  };
  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clear = () => {
    router.replace(pathname, { scroll: false });
  };

  return { get, getAll, set, remove, clear };
}
