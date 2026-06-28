
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // This would normally fetch from the API
        // await fetch(`http://localhost:5000/api/products/${id}`)
        // For demo purposes, we're using the mock data
        const sampleProducts = [
          {
            id: 1,
            name: "Classic T-Shirt",
            price: 24.99,
            description: "A comfortable everyday cotton t-shirt in classic style.",
            image: "/images/tshirt.jpg",
            category: "clothing"
          },
          {
            id: 2,
            name: "Wireless Headphones",
            price: 89.99,
            description: "High-quality wireless headphones with noise cancellation.",
            image: "/images/headphones.jpg",
            category: "electronics"
          },
          {
            id: 3,
            name: "Ceramic Coffee Mug",
            price: 12.99,
            description: "Elegant ceramic coffee mug, perfect for your morning brew.",
            image: "/images/mug.jpg",
            category: "home"
          },
          {
            id: 4,
            name: "Leather Wallet",
            price: 49.99,
            description: "Genuine leather wallet with multiple card slots.",
            image: "/images/wallet.jpg",
            category: "accessories"
          },
          {
            id: 5,
            name: "Fitness Tracker",
            price: 79.99,
            description: "Track your fitness goals with this sleek and durable tracker.",
            image: "/images/fitness.jpg",
            category: "electronics"
          },
          {
            id: 6,
            name: "Notebook Set",
            price: 19.99,
            description: "Set of 3 premium notebooks with lined pages.",
            image: "/images/notebook.jpg",
            category: "stationery"
          }
        ];
        
        const product = sampleProducts.find(p => p.id === parseInt(id || '0'));
        setProduct(product || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product?.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product information...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Product not found</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Shoppie</h1>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100">
                <ShoppingCart className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button variant="ghost" asChild className="flex items-center text-sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Product Detail */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="bg-gray-200 aspect-square flex items-center justify-center text-gray-500 rounded-lg">
              Product Image
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <Badge className="capitalize">{product.category}</Badge>
              </div>
              
              <div className="mt-4 border-t border-b py-4">
                <p className="text-3xl font-bold text-blue-900">${product.price.toFixed(2)}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-4 text-gray-700">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md p-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold">Shoppie</h3>
              <p className="mt-2 text-gray-400">Most trusted and exciting shopping app for you!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact</h3>
              <p className="mt-2 text-gray-400">contact@shoppie.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Shoppie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
