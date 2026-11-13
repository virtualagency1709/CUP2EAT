import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'CUP2EAT – Eat Your Drink! | Premium Edible Cookie & Wafer Cups',
  description:
    'Discover delicious experiences with CUP2EAT. Pour your favourite coffee, tea, hot chocolate, or shake, sip for 45+ minutes, and eat the crunchy cup! 100% Edible & Zero Waste.',
  keywords: [
    'edible cups',
    'eat your drink',
    'cup2eat',
    'cookie cup',
    'wafer cup',
    'chocolate cup',
    'zero waste coffee',
    'edible coffee cup India',
    'sustainable packaging',
  ],
  openGraph: {
    title: 'CUP2EAT – Eat Your Drink!',
    description: 'Crispy, delicious, 100% edible cookie and wafer cups lined with rich Belgian chocolate and flavours.',
    url: 'https://cup2eat.com',
    siteName: 'CUP2EAT',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'CUP2EAT Delicious Edible Cups',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CUP2EAT',
              url: 'https://cup2eat.com',
              logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
              description: 'Eat Your Drink! India’s revolutionary edible cookie and wafer cups brand.',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-9818192575',
                contactType: 'customer service',
                email: 'Varunkhera6@gmail.com',
                areaServed: 'IN',
                availableLanguage: ['en', 'hi'],
              },
              sameAs: ['https://www.instagram.com/cup2eat/'],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#26160F] antialiased selection:bg-brand-orange selection:text-white">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <WhatsAppButton />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
