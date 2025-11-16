import { SearchParamsMap } from '@/app/page';

export function toText(v: string | string[]) {
  return Array.isArray(v) ? v.join(', ') : v;
}

export function buildUrl(params: SearchParamsMap) {
  const flattened = new URLSearchParams();

  for (const key in params) {
    const v = params[key as keyof SearchParamsMap];
    if (!v) continue;

    if (Array.isArray(v)) {
      v.forEach((item) => flattened.append(key, item));
    } else {
      flattened.append(key, v);
    }
  }

  const query = flattened.toString();

  return `${process.env.NEXT_PUBLIC_API_URL}/${query ? `?${query}` : ''}`;
}
