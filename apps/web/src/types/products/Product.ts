import Category from "types/categories/Category";

export default interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  location: string;
  organization_id?: string;
  organization?: Object;
  product_categories?: Array<{
    id?: string;
    category?: Category;
    category_id?: string;
  }>;
}