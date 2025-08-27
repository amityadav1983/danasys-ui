import React, { useState } from 'react';
import api from '../services/api';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing backend connection...');
      
      // Test 1: Basic connection
      const response = await api.get('/api/product/productList');
      addResult(`✅ Product list API: ${response.status} - ${response.data?.length || 0} products`);
      
      // Test 2: Categories API
      const categoriesResponse = await api.get('/api/product/productCategoryList');
      addResult(`✅ Categories API: ${categoriesResponse.status} - ${categoriesResponse.data?.length || 0} categories`);
      
      addResult('🎉 All tests passed! Backend is working correctly.');
      
    } catch (error: any) {
      console.error('API Test Error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        addResult('❌ Network Error: Backend server is not running or not accessible');
        addResult('💡 Make sure your Java backend is running on http://localhost:8080');
      } else if (error.response?.status === 404) {
        addResult(`❌ 404 Error: Endpoint not found - ${error.config?.url}`);
        addResult('💡 Check if the API endpoint exists in your Java backend');
      } else if (error.message.includes('CORS')) {
        addResult('❌ CORS Error: Backend needs CORS configuration');
        addResult('💡 Add CORS configuration to your Java Spring Boot application');
      } else {
        addResult(`❌ Error: ${error.response?.status || 'Unknown'} - ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testRegistrationEndpoint = async () => {
    setIsLoading(true);
    addResult('Testing registration endpoint...');
    
    try {
      const testData = {
        email: 'test@example.com'
      };
      
      const response = await api.post('/public/registerUser/sendEmailOTP', testData);
      addResult(`✅ OTP API: ${response.status} - ${response.data}`);
      
    } catch (error: any) {
      console.error('Registration Test Error:', error);
      
      if (error.response?.status === 404) {
        addResult('❌ 404 Error: Registration endpoint not found');
        addResult('💡 Check if /public/registerUser/sendEmailOTP exists in your Java backend');
      } else {
        addResult(`❌ Registration Error: ${error.response?.status || 'Unknown'} - ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">🔧 API Connection Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button
          onClick={testRegistrationEndpoint}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Registration API'}
        </button>
      </div>
      
      <div className="bg-white p-3 rounded border max-h-64 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-gray-500">Click a test button to start testing...</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} className="text-sm font-mono mb-1">
              {result}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Backend URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}</p>
        <p><strong>Frontend URL:</strong> {window.location.origin}</p>
      </div>
    </div>
  );
};

export default ApiTest;



