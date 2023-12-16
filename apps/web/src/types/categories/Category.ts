import Product from '@pos_types/products/Product';

export default interface Category {
  id?: string;
  name: string;
  product_categories: Array<{
    id: string,
    product: Product
  }>;
}