import React from 'react';
import Head from 'next/head';
import { WaveBackground } from './WaveBackground';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <WaveBackground />
      <Head>
        <title>Crypto Price Alert</title>
        <meta name="description" content="Track cryptocurrency prices in real-time" />
      </Head>
      <div className="relative z-10 container mx-auto p-4">
        {children}
      </div>
    </div>
  );
}