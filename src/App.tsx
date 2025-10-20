import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { Toaster } from "react-hot-toast";   
import './App.css';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '12px 18px',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '12px 18px',
              boxShadow: '0 4px 10px rgba(239,68,68,0.4)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '10px',
              padding: '12px 18px',
            },
          },
        }}
      />
    </>
  );
}