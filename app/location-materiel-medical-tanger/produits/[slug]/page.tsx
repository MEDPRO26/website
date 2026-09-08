import {
  createLocationProductPage,
} from "@/lib/location-rental-product-page";

const { generateStaticParams, generateMetadata, Page } =
  createLocationProductPage("tanger");

export { generateStaticParams, generateMetadata };
export default Page;
