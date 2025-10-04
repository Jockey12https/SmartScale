import { ref, onValue, set, push, get, child } from 'firebase/database';
import { database } from './firebase';
import { Product, CartItem } from './mockData';

export interface ScaleData {
  weight: number;
  item: string;
  price: number;
  timestamp: string;
}

export interface ScaleSession {
  id: string;
  startTime: number;
  endTime?: number;
  items: CartItem[];
  total: number;
  status: 'active' | 'completed' | 'cancelled';
}

class ScaleService {
  private dataRef = database ? ref(database, 'SmartScale/data') : null;
  private productsRef = database ? ref(database, 'products') : null;
  private sessionsRef = database ? ref(database, 'sessions') : null;

  // Listen to real-time scale data
  onScaleData(callback: (data: ScaleData) => void) {
    if (!this.dataRef) {
      console.warn('Database not available - using mock data');
      return () => {};
    }
    console.log('Listening to Firebase path: SmartScale/data');
    return onValue(this.dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log('ScaleService received data:', data);
      if (data) {
        // Get the latest entry (most recent timestamp)
        const timestamps = Object.keys(data).sort((a, b) => parseInt(b) - parseInt(a));
        console.log('Available timestamps:', timestamps);
        if (timestamps.length > 0) {
          const latestEntry = data[timestamps[0]];
          console.log('Latest entry from ScaleService:', latestEntry);
          callback(latestEntry);
        }
      } else {
        console.log('No data received from SmartScale/data');
      }
    });
  }

  // Update scale data
  async updateScaleData(data: Partial<ScaleData>) {
    if (!this.dataRef) {
      console.warn('Database not available - scale data not updated');
      return;
    }
    try {
      const timestamp = Date.now().toString();
      const newDataRef = ref(database, `data/${timestamp}`);
      await set(newDataRef, {
        ...data,
        timestamp: timestamp
      });
    } catch (error) {
      console.error('Error updating scale data:', error);
      throw error;
    }
  }

  // Get all products from database
  async getProducts(): Promise<Product[]> {
    if (!this.productsRef) {
      console.warn('Database not available - returning empty products array');
      return [];
    }
    try {
      const snapshot = await get(this.productsRef);
      const products = snapshot.val();
      return products ? Object.values(products) : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Add product to database
  async addProduct(product: Omit<Product, 'id'>) {
    try {
      const newProductRef = push(this.productsRef);
      const productWithId = {
        ...product,
        id: newProductRef.key
      };
      await set(newProductRef, productWithId);
      return productWithId;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Create new scale session
  async createSession(): Promise<string> {
    try {
      const newSessionRef = push(this.sessionsRef);
      const sessionData: ScaleSession = {
        id: newSessionRef.key!,
        startTime: Date.now(),
        items: [],
        total: 0,
        status: 'active'
      };
      await set(newSessionRef, sessionData);
      return sessionData.id;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  // Add item to current session
  async addItemToSession(sessionId: string, item: CartItem) {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      const session = snapshot.val() as ScaleSession;
      
      if (session) {
        const updatedItems = [...session.items, item];
        const updatedTotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        await set(sessionRef, {
          ...session,
          items: updatedItems,
          total: updatedTotal
        });
      }
    } catch (error) {
      console.error('Error adding item to session:', error);
      throw error;
    }
  }

  // Complete session
  async completeSession(sessionId: string) {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      const session = snapshot.val() as ScaleSession;
      
      if (session) {
        await set(sessionRef, {
          ...session,
          endTime: Date.now(),
          status: 'completed'
        });
      }
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  // Get session data
  async getSession(sessionId: string): Promise<ScaleSession | null> {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      return snapshot.val();
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Listen to session updates
  onSessionUpdate(sessionId: string, callback: (session: ScaleSession) => void) {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    return onValue(sessionRef, (snapshot) => {
      const session = snapshot.val();
      if (session) {
        callback(session);
      }
    });
  }
}

export const scaleService = new ScaleService();
