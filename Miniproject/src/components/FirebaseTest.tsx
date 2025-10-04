import React, { useState, useEffect } from 'react';
import { testFirebaseConnection, getConnectionStatus, listenToScaleData } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Loader2, Database, Wifi, WifiOff } from 'lucide-react';

interface FirebaseTestProps {
  className?: string;
}

export const FirebaseTest: React.FC<FirebaseTestProps> = ({ className }) => {
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [scaleData, setScaleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial connection status
    setConnectionStatus(getConnectionStatus());
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
      setConnectionStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
      setTestResult(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleListenToScale = () => {
    const unsubscribe = listenToScaleData((data) => {
      setScaleData(data);
      console.log('Scale data received:', data);
    });

    // Cleanup after 10 seconds
    setTimeout(() => {
      unsubscribe();
    }, 10000);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firebase Connection Test
          </CardTitle>
          <CardDescription>
            Test your Firebase connection and monitor real-time data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connectionStatus ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span>Connection Status:</span>
            </div>
            <Badge variant={connectionStatus ? "default" : "destructive"}>
              {connectionStatus ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {/* Test Button */}
          <Button 
            onClick={handleTestConnection} 
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Test Firebase Connection
              </>
            )}
          </Button>

          {/* Test Result */}
          {testResult !== null && (
            <Alert>
              <div className="flex items-center gap-2">
                {testResult ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  {testResult 
                    ? "Firebase connection test successful!" 
                    : "Firebase connection test failed. Check your configuration."
                  }
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Scale Data Listener */}
          <div className="space-y-2">
            <Button 
              onClick={handleListenToScale} 
              variant="outline" 
              className="w-full"
              disabled={!connectionStatus}
            >
              Listen to Scale Data (10s)
            </Button>
            
            {scaleData && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Latest Scale Data:</h4>
                <pre className="text-sm text-gray-600 overflow-auto">
                  {JSON.stringify(scaleData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Configuration Help */}
          {!connectionStatus && (
            <Alert>
              <AlertDescription>
                <strong>Setup Required:</strong> Create a <code>.env</code> file in your project root with your Firebase configuration. 
                See <code>FIREBASE_SETUP.md</code> for detailed instructions.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTest;
