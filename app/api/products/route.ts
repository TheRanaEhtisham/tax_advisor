import { products } from "@/data/products";

export async function GET() {
  return Response.json(products);
}
