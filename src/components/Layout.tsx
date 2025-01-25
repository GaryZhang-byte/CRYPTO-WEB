import React from 'react';
import Head from 'next/head';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Crypto Price Alert</title>
        <meta name="description" content="Track cryptocurrency prices in real-time" />
      </Head>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Crypto Price Alert</h1>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 