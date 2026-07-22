import {
  createLocationProductPage,
} from "@/lib/location-rental-product-page";

const { generateStaticParams, generateMetadata, Page } =
  createLocationProductPage("marrakech");

export { generateStaticParams, generateMetadata };
export default Page;
