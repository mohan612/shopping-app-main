
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-w-3 aspect-h-2 bg-gray-200">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          Product Image
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant="outline">{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant="outline" 
            className="flex items-center justify-center"
            asChild
          >
            <Link to={`/product/${product.id}`}>Details</Link>
          </Button>
          <Button 
            className="flex items-center justify-center"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
