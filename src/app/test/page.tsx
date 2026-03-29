'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function TestPage() {
  const [status, setStatus] = useState('Testing connection...');
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/')
      .then(response => {
        setStatus('✅ Connected!');
        setData(response.data);
      })
      .catch(error => {
        setStatus('❌ Connection failed');
        setData(error.message);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
        <p className="text-lg mb-2">Status: {status}</p>
        <pre className="bg-gray-100 p-4 rounded mt-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}