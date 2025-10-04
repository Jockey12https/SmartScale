import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Product, formatCurrency, formatWeight } from '@/lib/mockData';
import { Scale, DollarSign, Calculator } from 'lucide-react';

interface WeightPricingProps {
  product: Product | null;
  weight: number;
  isWeighing: boolean;
}

export default function WeightPricing({ product, weight, isWeighing }: WeightPricingProps) {
  const totalPrice = product ? weight * product.pricePerKg : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-center text-gray-800">
          Weight & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight Display */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Weight</span>
          </div>
          <div className="text-right">
            {isWeighing ? (
              <div className="animate-pulse">
                <div className="h-6 bg-blue-200 rounded w-16"></div>
              </div>
            ) : (
              <span className="text-xl font-bold text-blue-600">
                {formatWeight(weight)}
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* Unit Price */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">Price per kg</span>
          </div>
          <div className="text-right">
            {product ? (
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(product.pricePerKg)}
              </span>
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Total Price */}
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-700">Total Price</span>
          </div>
          <div className="text-right">
            {product && !isWeighing ? (
              <span className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalPrice)}
              </span>
            ) : (
              <span className="text-gray-400 text-xl">--</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        {product && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 text-center">
              <span className="font-medium">{product.name}</span>
              <br />
              {formatWeight(weight)} × {formatCurrency(product.pricePerKg)} = {formatCurrency(totalPrice)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}