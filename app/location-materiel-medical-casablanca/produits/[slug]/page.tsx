import {
  createLocationProductPage,
} from "@/lib/location-rental-product-page";

const { generateStaticParams, generateMetadata, Page } =
  createLocationProductPage("casablanca");

export { generateStaticParams, generateMetadata };
export default Page;
