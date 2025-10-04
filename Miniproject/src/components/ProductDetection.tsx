import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/mockData';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ProductDetectionProps {
  product: Product | null;
  isDetecting: boolean;
}

export default function ProductDetection({ product, isDetecting }: ProductDetectionProps) {
  if (isDetecting) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center animate-pulse">
              <div className="text-gray-500 text-lg font-medium">Detecting...</div>
            </div>
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
              <div className="text-blue-600 text-lg font-medium text-center">
                Place item on scale
                <br />
                <span className="text-sm text-blue-500">for automatic detection</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const confidenceColor = product.confidence && product.confidence >= 0.9 ? 'green' : 
                         product.confidence && product.confidence >= 0.8 ? 'yellow' : 'red';
  
  const ConfidenceIcon = product.confidence && product.confidence >= 0.8 ? CheckCircle : AlertCircle;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 object-cover rounded-lg shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Product+Image';
              }}
            />
            <div className="absolute top-2 right-2">
              <Badge 
                variant={confidenceColor === 'green' ? 'default' : 'secondary'}
                className={`${
                  confidenceColor === 'green' ? 'bg-green-500 hover:bg-green-600' :
                  confidenceColor === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                  'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                <ConfidenceIcon className="w-3 h-3 mr-1" />
                {product.confidence ? `${Math.round(product.confidence * 100)}%` : 'N/A'}
              </Badge>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}