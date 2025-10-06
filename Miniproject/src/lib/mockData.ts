export interface Product {
    id: string;
    name: string;
    image: string;
    pricePerKg: number;
    category: 'fruit' | 'vegetable';
    confidence?: number;
  }
  
  export interface CartItem {
    product: Product;
    weight: number;
    totalPrice: number;
    timestamp: Date;
  }
  
  export const mockProducts: Product[] = [
    {
      id: 'apple-red',
      name: 'Red Apple',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
      pricePerKg: 3.99,
      category: 'fruit',
      confidence: 0.95
    },
    {
      id: 'banana',
      name: 'Banana',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
      pricePerKg: 2.49,
      category: 'fruit',
      confidence: 0.92
    },
    {
      id: 'orange',
      name: 'Orange',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop',
      pricePerKg: 4.29,
      category: 'fruit',
      confidence: 0.88
    },
    {
      id: 'tomato',
      name: 'Tomato',
      image: 'https://images.unsplash.com/photo-1546470427-e5380e2e9c95?w=400&h=400&fit=crop',
      pricePerKg: 5.99,
      category: 'vegetable',
      confidence: 0.91
    },
    {
      id: 'carrot',
      name: 'Carrot',
      image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop',
      pricePerKg: 2.99,
      category: 'vegetable',
      confidence: 0.94
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
      pricePerKg: 6.49,
      category: 'vegetable',
      confidence: 0.89
    }
  ];
  
  // Simulate weight sensor data
  export const simulateWeight = (): number => {
    return Math.round((Math.random() * 2 + 0.1) * 100) / 100; // 0.1 to 2.1 kg
  };
  
  // Simulate product detection
  export const simulateProductDetection = (): Product => {
    const randomIndex = Math.floor(Math.random() * mockProducts.length);
    return mockProducts[randomIndex];
  };
  
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  export const formatWeight = (weight: number): string => {
    return `${weight.toFixed(2)} kg`;
  };