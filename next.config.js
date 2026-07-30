const path = require('path');

const cwd = process.cwd();
const folderName = path.basename(cwd);

let basePath = '';
if (folderName.startsWith('mfe-')) {
  basePath = '/' + folderName.replace('mfe-', '');
}

const CRYPTO_URL = process.env.NEXT_PUBLIC_CRYPTO_URL || 'http://localhost:8991';
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8992';
const NOTIFICATIONS_URL = process.env.NEXT_PUBLIC_NOTIFICATIONS_URL || 'http://localhost:8993';
const EMAIL_URL = process.env.NEXT_PUBLIC_EMAIL_URL || 'http://localhost:8994';
const CAMPAIGNS_URL = process.env.NEXT_PUBLIC_CAMPAIGNS_URL || 'http://localhost:8995';
const FIELDSERVICE_URL = process.env.NEXT_PUBLIC_FIELDSERVICE_URL || 'http://localhost:8996';
const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || 'http://localhost:8997';
const JOBS_URL = process.env.NEXT_PUBLIC_JOBS_URL || 'http://localhost:8998';

const nextConfig = {
  basePath: basePath,
  reactStrictMode: false, // Prevents duplicate double-render compilation overhead in dev mode
  swcMinify: true,
  experimental: {
    proxyTimeout: 120000,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-dropdown-menu'],
  },
  webpack: (config, { dev }) => {
    config.resolve.alias['@shared/index'] = path.resolve(__dirname, 'shared/src/index.ts');
    config.resolve.alias['@shared'] = path.resolve(__dirname, 'shared/src');
    
    // Speed up Webpack dev compilation & prevent memory bottlenecks when 9 MFEs run concurrently
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.next/**'],
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

// Add Multi Zones rewrites for host app 'procureiq-nextjs'
if (folderName === 'procureiq-nextjs') {
  nextConfig.rewrites = async () => {
    return [
      {
        source: '/crypto',
        destination: `${CRYPTO_URL}/`,
      },
      {
        source: '/crypto/:path*',
        destination: `${CRYPTO_URL}/:path*`,
      },
      {
        source: '/auth',
        destination: `${AUTH_URL}/`,
      },
      {
        source: '/auth/:path*',
        destination: `${AUTH_URL}/:path*`,
      },
      {
        source: '/notifications',
        destination: `${NOTIFICATIONS_URL}/`,
      },
      {
        source: '/notifications/:path*',
        destination: `${NOTIFICATIONS_URL}/:path*`,
      },
      {
        source: '/email',
        destination: `${EMAIL_URL}/`,
      },
      {
        source: '/email/:path*',
        destination: `${EMAIL_URL}/:path*`,
      },
      {
        source: '/campaigns',
        destination: `${CAMPAIGNS_URL}/`,
      },
      {
        source: '/campaigns/:path*',
        destination: `${CAMPAIGNS_URL}/:path*`,
      },
      {
        source: '/fieldservice',
        destination: `${FIELDSERVICE_URL}/`,
      },
      {
        source: '/fieldservice/:path*',
        destination: `${FIELDSERVICE_URL}/:path*`,
      },
      {
        source: '/github',
        destination: `${GITHUB_URL}/`,
      },
      {
        source: '/github/:path*',
        destination: `${GITHUB_URL}/:path*`,
      },
      {
        source: '/jobs',
        destination: `${JOBS_URL}/`,
      },
      {
        source: '/jobs/:path*',
        destination: `${JOBS_URL}/:path*`,
      },
    ];
  };
}

module.exports = nextConfig;
