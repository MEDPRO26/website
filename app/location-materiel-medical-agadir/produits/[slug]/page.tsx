import {
  createLocationProductPage,
} from "@/lib/location-rental-product-page";

const { generateStaticParams, generateMetadata, Page } =
  createLocationProductPage("agadir");

export { generateStaticParams, generateMetadata };
export default Page;
