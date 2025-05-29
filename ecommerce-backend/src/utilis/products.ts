
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  sellerId: number;
  sellerName: string;
  createdAt: Date;
  updatedAt: Date;
}