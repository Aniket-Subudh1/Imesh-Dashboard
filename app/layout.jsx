import './globals.css';

export const metadata = {
  title: 'IMESH Dashboard',
  description: 'Service Mesh Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <div className="flex min-h-screen bg-gray-50" suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}