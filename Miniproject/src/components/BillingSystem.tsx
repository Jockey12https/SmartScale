import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CartItem, formatCurrency, formatWeight } from '@/lib/mockData';
import { ShoppingCart, Trash2, Receipt, CreditCard } from 'lucide-react';

interface BillingSystemProps {
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  onClearCart: () => void;
}

export default function BillingSystem({ 
  cartItems, 
  onRemoveItem, 
  onCheckout, 
  onClearCart 
}: BillingSystemProps) {
  
  const printReceipt = () => {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalWeight = cartItems.reduce((sum, item) => sum + item.weight, 0);
    
    // Create a small receipt window
    const receiptWindow = window.open('', '_blank', 'width=300,height=400');
    if (!receiptWindow) return;
    
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
            margin: 10px; 
            line-height: 1.2;
            background: white;
          }
          .receipt { 
            width: 250px; 
            margin: 0 auto; 
            text-align: center; 
          }
          .header { 
            border-bottom: 1px dashed #000; 
            padding-bottom: 10px; 
            margin-bottom: 10px; 
          }
          .item { 
            display: flex; 
            justify-content: space-between; 
            margin: 5px 0; 
            font-size: 11px;
          }
          .total { 
            border-top: 1px dashed #000; 
            padding-top: 10px; 
            margin-top: 10px; 
            font-weight: bold; 
          }
          .footer { 
            margin-top: 15px; 
            font-size: 10px; 
            color: #666; 
          }
          @media print {
            body { margin: 0; }
            .receipt { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>SMART SCALE SYSTEM</h2>
            <p>Receipt #${Date.now().toString().slice(-6)}</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
          
          <div class="items">
            ${cartItems.map(item => `
              <div class="item">
                <span>${item.product.name}</span>
                <span>$${item.totalPrice.toFixed(2)}</span>
              </div>
              <div class="item" style="font-size: 10px; color: #666;">
                <span>${item.weight}kg × $${item.product.pricePerKg}/kg</span>
                <span></span>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <div class="item">
              <span>Total Weight:</span>
              <span>${totalWeight.toFixed(2)}kg</span>
            </div>
            <div class="item">
              <span>TOTAL:</span>
              <span>$${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>Smart Scale System v1.0</p>
          </div>
        </div>
      </body>
      </html>
    `);
    
    receiptWindow.document.close();
    
    // Auto print after a short delay
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWeight = cartItems.reduce((sum, item) => sum + item.weight, 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center justify-between text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Shopping Cart</span>
            <span className="sm:hidden">Cart</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-4 p-2 sm:p-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-4 sm:py-8 text-gray-500">
            <ShoppingCart className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
            <p className="text-sm sm:text-base">Your cart is empty</p>
            <p className="text-xs sm:text-sm">Add items by placing them on the scale</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/48x48/e5e7eb/6b7280?text=?';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs sm:text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatWeight(item.weight)} × {formatCurrency(item.product.pricePerKg)}/kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xs sm:text-sm">{formatCurrency(item.totalPrice)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                      className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Total Weight:</span>
                <span className="font-medium">{formatWeight(totalWeight)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-green-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-1 sm:space-y-2">
              <Button 
                onClick={onCheckout} 
                className="w-full text-sm sm:text-base" 
                size="sm"
                disabled={cartItems.length === 0}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Proceed to Payment</span>
                <span className="sm:hidden">Checkout</span>
              </Button>
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                <Button 
                  variant="outline" 
                  onClick={onClearCart}
                  className="flex-1 text-xs sm:text-sm"
                  size="sm"
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Clear Cart</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => printReceipt()}
                  className="flex-1 text-xs sm:text-sm"
                  size="sm"
                  disabled={cartItems.length === 0}
                >
                  <Receipt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Print Receipt</span>
                  <span className="sm:hidden">Print</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}