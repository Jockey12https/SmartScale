import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Product, formatCurrency, formatWeight } from '@/lib/mockData';
import { scaleService } from '@/lib/scaleService';
import { Check, X, Search, RotateCcw } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  weight: number;
  onConfirm: (product: Product, weight: number) => void;
  onRescan: () => void;
}

export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  product, 
  weight, 
  onConfirm, 
  onRescan 
}: ConfirmationDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const firebaseProducts = await scaleService.getProducts();
        setProducts(firebaseProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  if (!product) return null;

  const totalPrice = weight * product.pricePerKg;
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    onConfirm(product, weight);
    onClose();
  };

  const handleProductSelect = (selectedProduct: Product) => {
    onConfirm(selectedProduct, weight);
    onClose();
    setShowAlternatives(false);
    setSearchTerm('');
  };

  const handleRescan = () => {
    onRescan();
    onClose();
    setShowAlternatives(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Confirm Your Selection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Summary */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=?';
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{product.category}</Badge>
                {product.confidence && (
                  <Badge variant={product.confidence >= 0.9 ? 'default' : 'secondary'}>
                    {Math.round(product.confidence * 100)}% sure
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between">
              <span>Weight:</span>
              <span className="font-semibold">{formatWeight(weight)}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per kg:</span>
              <span className="font-semibold">{formatCurrency(product.pricePerKg)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Confirmation Question */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-800">Is this correct?</p>
          </div>

          {/* Alternative Products Search */}
          {showAlternatives && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="search">Search for correct item:</Label>
                <Input
                  id="search"
                  placeholder="Type product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-2">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/40x40/e5e7eb/6b7280?text=?';
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(p.pricePerKg)}/kg</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col space-y-2">
          {!showAlternatives ? (
            <>
              <div className="flex space-x-2 w-full">
                <Button onClick={handleConfirm} className="flex-1" size="lg">
                  <Check className="w-4 h-4 mr-2" />
                  Yes, Add to Cart
                </Button>
              </div>
              <div className="flex space-x-2 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAlternatives(true)}
                  className="flex-1"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Wrong Item
                </Button>
                <Button variant="outline" onClick={handleRescan} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Re-scan
                </Button>
              </div>
            </>
          ) : (
            <div className="flex space-x-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setShowAlternatives(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}