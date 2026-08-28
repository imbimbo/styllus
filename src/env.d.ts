/// <reference types="astro/client" />

declare module '*.json' {
  const value: {
    rating: number;
    total: number;
    mapsUrl: string;
    reviews: Array<{
      quote: string;
      name: string;
      role?: string;
      rating?: number;
    }>;
  };
  export default value;
}
