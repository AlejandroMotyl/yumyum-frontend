import { Metadata } from 'next';
import { GenerateMetadataParams } from '@/types/metadata';
import { SITE_DOMAIN, SITE_NAME } from '@/config/metadata';

export function generateMetadataGlobal({
  title,
  description,
  path = '',
  image = {
    url: '',
    width: 1200,
    height: 630,
    alt: '',
  },
}: GenerateMetadataParams): Metadata {
  const baseUrl = SITE_DOMAIN || 'https://yumyum-frontend.vercel.app';
  const url = path ? `${baseUrl}/${path}` : baseUrl;

  // If no image.url — use default img
  const imageUrl = image.url || 'hero/hero-mobile.jpg';

  // generate img url
  const absoluteImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteImageUrl,
          width: image?.width || 1200,
          height: image?.height || 630,
          alt: image?.alt || title,
        },
      ],
    },
  };
}

//TODO how to use in the component

//export async function generateMetadata(): Promise<Metadata> {
//  return generateMetadataGlobal({
//    title: 'YumYum Recipes',
//    description:
//      'Browse thousands of delicious YumYum recipes — filter by category, ingredient, or keyword',
//    path: '',
//    image: {
//      url: 'hero/hero-tablet.jpg',
//      alt: 'YumYum Recipes',
//    },
//  });
//}
