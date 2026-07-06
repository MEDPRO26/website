import { blogPosts } from "@/lib/blog";

export function getBlogPostsForProduct(productSlug: string) {
  return blogPosts.filter((post) => post.relatedProducts?.includes(productSlug));
}

export function getBlogPostsForCategory(category: string) {
  return blogPosts.filter((post) => post.category === category);
}
