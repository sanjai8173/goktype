import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://typing.gokgok.in/sitemap.xml',
    host: 'https://typing.gokgok.in',
  };
}
