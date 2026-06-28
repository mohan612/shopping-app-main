
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag } from 'lucide-react';
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

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // In a production app, we would fetch from the actual API
    // For now, we'll use the sample data as if it came from an API
    const fetchProducts = async () => {
      try {
        // This would normally be: await fetch('http://localhost:5000/api/products')
        // But for the demo, we'll simulate the data as if it came from our Python backend
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

        setProducts(sampleProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(sampleProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category === activeCategory)
    : products;

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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Shoppie
          </h2>
          <p className="mt-6 text-xl max-w-3xl">
            Your one-stop shop for quality products, powered by Python and React.
          </p>
          <div className="mt-10">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              Browse Products
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex overflow-x-auto py-2 space-x-2">
          <Button 
            variant={activeCategory === null ? "default" : "outline"} 
            onClick={() => setActiveCategory(null)}
            className="flex items-center whitespace-nowrap"
          >
            All Products
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="flex items-center whitespace-nowrap"
            >
              <Tag className="h-4 w-4 mr-1" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
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
                      onClick={() => alert(`Added ${product.name} to cart!`)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

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

export default Index;
