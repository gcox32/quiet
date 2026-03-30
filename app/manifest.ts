import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quiet',
    short_name: 'Quiet',
    description: 'A space for stillness — scripture, prayer, and reflection.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5EDD6',
    theme_color: '#8B6D3F',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
