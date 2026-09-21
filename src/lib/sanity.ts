import {sanityClient} from 'sanity:client'
import {defineQuery} from 'groq'
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    category,
    excerpt,
    mainImage
  }
`)

const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    category,
    excerpt,
    mainImage,
    body
  }
`)

const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "params": { "slug": slug.current }
  }
`)

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function getPosts() {
  return sanityClient.fetch(POSTS_QUERY)
}

export async function getPost(slug: string) {
  return sanityClient.fetch(POST_QUERY, {slug})
}

export async function getPostStaticPaths() {
  return sanityClient.fetch(POST_SLUGS_QUERY)
}
