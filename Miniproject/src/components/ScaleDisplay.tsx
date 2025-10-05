import { useState, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, CartItem } from '@/lib/mockData';
import { scaleService, ScaleData } from '@/lib/scaleService';
import { seedDatabase, initializeScaleData } from '@/lib/seedDatabase';
import { Scale, Zap, RefreshCw, Database, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Lazy load components
const ProductDetection = lazy(() => import('./ProductDetection'));
const WeightPricing = lazy(() => import('./WeightPricing'));
const ConfirmationDialog = lazy(() => import('./ConfirmationDialog'));
const BillingSystem = lazy(() => import('./BillingSystem'));

export default function ScaleDisplay() {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isWeighing, setIsWeighing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [scaleStatus, setScaleStatus] = useState<'idle' | 'active' | 'ready'>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [latestData, setLatestData] = useState<ScaleData | null>(null);
  const [detectionStartTime, setDetectionStartTime] = useState<number | null>(null);

  // Initialize Firebase connection and listen to real-time data
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize scale data
        await initializeScaleData();
        
        // Set connection status
        setIsConnected(true);
        
        // Listen to real-time scale data
        const unsubscribe = scaleService.onScaleData((data: ScaleData) => {
          console.log('Latest Firebase data received:', data);
          console.log('Data details:', {
            weight: data.weight,
            item: data.item,
            price: data.price,
            timestamp: data.timestamp
          });
          
          // Only process data that comes after detection starts
          const dataTimestamp = parseInt(data.timestamp);
          console.log('Data timestamp:', dataTimestamp, 'Detection start time:', detectionStartTime);
          
          if (detectionStartTime && dataTimestamp > detectionStartTime) {
            console.log('✅ New data received after detection started');
            setLatestData(data);
            setCurrentWeight(data.weight);
            
            // Create a product object from the scale data
            if (data.item && data.item !== "OniGarlicGarlicGarlicGarlicGarlic") {
              console.log('Valid item detected:', data.item);
              const product: Product = {
                id: data.item.toLowerCase().replace(/\s+/g, '-'),
                name: data.item,
                image: `https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop`,
                pricePerKg: data.price || 0,
                category: 'fruit', // Default category
                confidence: 0.95
              };
              setCurrentProduct(product);
              
              if (data.weight > 0) {
                console.log('Weight > 0, stopping detection');
                setIsDetecting(false);
                setIsWeighing(false);
                setScaleStatus('ready');
                setShowConfirmation(true);
                toast.success(`Detected: ${data.item} (${data.weight}kg)`);
              } else {
                console.log('Weight is 0, continuing to wait');
              }
            } else {
              console.log('Invalid item or no item detected:', data.item);
            }
          } else {
            console.log('❌ Old data received, ignoring (detection not started or old timestamp)');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setIsConnected(false);
        toast.error('Firebase connection failed');
      }
    };

    initializeFirebase();
  }, [isDetecting]);

  // Initialize database with product data on first load
  useEffect(() => {
    const seedData = async () => {
      try {
        await seedDatabase();
        toast.success('Database initialized with product data');
      } catch (error) {
        console.error('Error seeding database:', error);
        toast.warning('Using local mock data');
      }
    };

    seedData();
  }, []);

  // Activate scale and start new session
  const handleActivateScale = async () => {
    try {
      setScaleStatus('active');
      setIsDetecting(true);
      setIsWeighing(true);
      
      // Set detection start time to filter out old data
      const startTime = Date.now();
      setDetectionStartTime(startTime);
      console.log('🚀 Detection started at:', startTime);
      
      // Test the detection start time after a short delay
      setTimeout(() => {
        console.log('🔍 Current detection start time state:', detectionStartTime);
      }, 100);
      
      // Create new session
      const sessionId = await scaleService.createSession();
      setCurrentSessionId(sessionId);
      
      // Update scale to active state
      await scaleService.updateScaleData({
        weight: 0,
        item: "",
        price: 0,
        timestamp: startTime.toString()
      });
      
      toast.info('Scale activated - place item on scale');
      
      // Add timeout to prevent infinite detecting state
      setTimeout(() => {
        if (isDetecting && scaleStatus === 'active') {
          console.log('Detection timeout - no data received');
          toast.warning('No item detected. Try placing item on scale or check Firebase data.');
          setScaleStatus('idle');
          setIsDetecting(false);
          setIsWeighing(false);
        }
      }, 30000); // 30 second timeout
      
    } catch (error) {
      console.error('Error activating scale:', error);
      toast.error('Failed to activate scale');
    }
  };

  const handleConfirmProduct = async (product: Product, weight: number) => {
    try {
      const cartItem: CartItem = {
        product,
        weight,
        totalPrice: weight * product.pricePerKg,
        timestamp: new Date()
      };
      
      // Add item to cart (local state)
      setCartItems(prev => [...prev, cartItem]);
      setCurrentProduct(null);
      setCurrentWeight(0);
      setScaleStatus('idle');
      
      // Try to add to Firebase session (optional)
      if (currentSessionId) {
        try {
          await scaleService.addItemToSession(currentSessionId, cartItem);
          console.log('Item added to Firebase session');
        } catch (sessionError) {
          console.warn('Failed to add to Firebase session, but item added to cart:', sessionError);
        }
      }
      
      // Reset scale data (optional)
      try {
        await scaleService.updateScaleData({
          weight: 0,
          item: "",
          price: 0,
          timestamp: Date.now().toString()
        });
      } catch (scaleError) {
        console.warn('Failed to reset scale data, but item added to cart:', scaleError);
      }
      
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error('Error confirming product:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRescan = async () => {
    try {
      setCurrentProduct(null);
      setCurrentWeight(0);
      setScaleStatus('idle');
      
      // Reset scale data
      await scaleService.updateScaleData({
        weight: 0,
        item: "",
        price: 0,
        timestamp: Date.now().toString()
      });
      
      toast.info('Ready for new item');
    } catch (error) {
      console.error('Error during rescan:', error);
      toast.error('Failed to reset scale');
    }
  };

  const handleStopDetection = () => {
    setScaleStatus('idle');
    setIsDetecting(false);
    setIsWeighing(false);
    setDetectionStartTime(null);
    toast.info('Detection stopped');
  };

  const handleRemoveItem = (index: number) => {
    const item = cartItems[index];
    setCartItems(prev => prev.filter((_, i) => i !== index));
    toast.success(`Removed ${item.product.name} from cart`);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // Complete the current session
      if (currentSessionId) {
        await scaleService.completeSession(currentSessionId);
      }
      
      toast.success(`Checkout successful! Total: $${total.toFixed(2)}`);
      setCartItems([]);
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to complete checkout');
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  const handleFetchLatestData = async () => {
    try {
      // Use the existing scaleService instead of dynamic imports
      const latestData = await scaleService.getLatestData();
      if (latestData) {
        setLatestData(latestData);
        setCurrentWeight(latestData.weight);
        
        if (latestData.item && latestData.item !== "OniGarlicGarlicGarlicGarlicGarlic") {
          const product: Product = {
            id: latestData.item.toLowerCase().replace(/\s+/g, '-'),
            name: latestData.item,
            image: `https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop`,
            pricePerKg: latestData.price || 0,
            category: 'fruit',
            confidence: 0.95
          };
          setCurrentProduct(product);
          
          if (latestData.weight > 0) {
            setIsDetecting(false);
            setIsWeighing(false);
            setScaleStatus('ready');
            setShowConfirmation(true);
            toast.success(`Fetched latest data: ${latestData.item} (${latestData.weight}kg)`);
          }
        }
      } else {
        console.log('No data found');
        toast.info('No existing data found');
      }
    } catch (error) {
      console.error('Error fetching existing data:', error);
      toast.error('Failed to fetch existing data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Smart Scale System</h1>
          <p className="text-sm sm:text-lg text-gray-600">Intelligent Fruit & Vegetable Weighing</p>
        </div>

        {/* Status Bar */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  <div className="text-sm sm:text-base">
                    <span className="font-medium">Scale: </span>
                    <Badge 
                      variant={scaleStatus === 'ready' ? 'default' : scaleStatus === 'active' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {scaleStatus === 'idle' ? 'Ready' : 
                       scaleStatus === 'active' ? 'Detecting...' : 'Item Detected'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Button
                  onClick={handleActivateScale}
                  disabled={scaleStatus === 'active'}
                  className="flex items-center space-x-2 w-full sm:w-auto text-sm"
                  size="sm"
                >
                  {scaleStatus === 'active' ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {scaleStatus === 'active' ? 'Detecting...' : 'Start Detection'}
                  </span>
                  <span className="sm:hidden">
                    {scaleStatus === 'active' ? 'Detecting...' : 'Start'}
                  </span>
                </Button>
                {scaleStatus === 'active' && (
                  <Button
                    onClick={handleStopDetection}
                    variant="destructive"
                    className="flex items-center space-x-2 w-full sm:w-auto text-sm"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Stop Detection</span>
                    <span className="sm:hidden">Stop</span>
                  </Button>
                )}
                <Button
                  onClick={handleFetchLatestData}
                  variant="outline"
                  className="flex items-center space-x-2 w-full sm:w-auto text-sm"
                  size="sm"
                >
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Fetch Existing Data</span>
                  <span className="sm:hidden">Fetch</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Product Detection */}
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Product Detection</h2>
            <Suspense fallback={<div className="flex items-center justify-center h-32">Loading...</div>}>
              <ProductDetection 
                product={currentProduct} 
                isDetecting={isDetecting} 
              />
            </Suspense>
          </div>

          {/* Weight & Pricing */}
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Weight & Pricing</h2>
            <Suspense fallback={<div className="flex items-center justify-center h-32">Loading...</div>}>
              <WeightPricing 
                product={currentProduct}
                weight={currentWeight}
                isWeighing={isWeighing}
              />
            </Suspense>
          </div>

          {/* Billing System */}
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Billing System</h2>
            <Suspense fallback={<div className="flex items-center justify-center h-32">Loading...</div>}>
              <BillingSystem
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                onClearCart={handleClearCart}
              />
            </Suspense>
          </div>
        </div>

        {/* Latest Data Display */}
        {latestData && (
          <Card className="mt-4 sm:mt-6">
            <CardContent className="p-2 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center">Smart Scale Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{latestData.weight}kg</div>
                  <div className="text-xs sm:text-sm text-gray-600">Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-semibold text-green-600 truncate">{latestData.item || 'No Item'}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Item</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">${latestData.price || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Price</div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-mono text-gray-500">
                    {new Date(parseInt(latestData.timestamp)).toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-4 sm:mt-8">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center">How to Use</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold text-sm sm:text-base">1</span>
                </div>
                <p className="text-xs sm:text-sm">Click "Start" to activate scale</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold text-sm sm:text-base">2</span>
                </div>
                <p className="text-xs sm:text-sm">System detects and weighs automatically</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-orange-600 font-bold text-sm sm:text-base">3</span>
                </div>
                <p className="text-xs sm:text-sm">Confirm item or make corrections</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold text-sm sm:text-base">4</span>
                </div>
                <p className="text-xs sm:text-sm">Add to cart and checkout</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          product={currentProduct}
          weight={currentWeight}
          onConfirm={handleConfirmProduct}
          onRescan={handleRescan}
        />
      </Suspense>
    </div>
  );
}