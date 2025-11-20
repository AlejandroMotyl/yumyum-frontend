import { Metadata } from 'next';
import { GenerateMetadataParams } from '@/types/metadata';
import { SITE_DOMAIN, SITE_NAME, OG_IMAGE } from '@/config/metadata';

export function generateMetadataGlobal({
  title,
  description,
  path = '',
  image = OG_IMAGE,
}: GenerateMetadataParams): Metadata {
  const url = path ? `${SITE_DOMAIN}/${path}` : SITE_DOMAIN;

  // If no image.url — use default img
  const imageUrl = image.url || OG_IMAGE.url;

  // generate img url
  const absoluteImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${SITE_DOMAIN}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  return {
    title,
    description,
    metadataBase: new URL(SITE_DOMAIN),
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteImageUrl,
          width: image?.width || OG_IMAGE.width,
          height: image?.height || OG_IMAGE.height,
          alt: image?.alt || title,
        },
      ],
    },
  };
}

//TODO using on main page
//export async function generateMetadata(): Promise<Metadata> {
//  const title = `YumYum Recipes`;
//  const description = `Browse thousands of delicious YumYum recipes — filter by category, ingredient, or keyword.`;
//  return generateMetadataGlobal({
//    title,
//    description,
//    image: {
//      url: 'hero/hero-tablet.jpg',
//      alt: title,
//    },
//  });
//}

//TODO how to use in the component app/[recipeId]/page.tsx
//export async function generateMetadata({ params }): Promise<Metadata> {
//    const recipe = await getRecipe(params.recipeId);
//
//    return generateMetadataGlobal({
//      title: recipe.title,
//      description: recipe.description,
//      path: `recipes/${params.recipeId}`,
//      image: {
//        url: recipe.image, // ← динамическое изображение рецепта
//        width: 1200,
//        height: 630,
//        alt: recipe.title,
//      },
//    });
//  }
