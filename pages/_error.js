import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';

function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>
          {statusCode ? `Error ${statusCode}` : 'An error occurred'} - ImageOptimizer
        </title>
        <meta name="description" content="An error occurred while processing your request." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-6xl font-bold text-primary-500 mb-4">
              {statusCode || '?'}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {statusCode === 404 ? 'Page Not Found' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {statusCode === 404 
                ? "The page you're looking for doesn't exist or has been moved."
                : "We're sorry, but something unexpected happened. Please try again."
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
