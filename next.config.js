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
  reactStrictMode: true,
  transpilePackages: [],
  webpack: (config) => {
    config.resolve.alias['@shared/index'] = path.resolve(__dirname, 'shared/src/index.ts');
    config.resolve.alias['@shared'] = path.resolve(__dirname, 'shared/src');
    return config;
  },
};

// Add Multi Zones rewrites for host app 'procureiq-nextjs'
if (folderName === 'procureiq-nextjs') {
  nextConfig.rewrites = async () => {
    return [
      {
        source: '/crypto',
        destination: `${CRYPTO_URL}/crypto/`,
      },
      {
        source: '/crypto/:path*',
        destination: `${CRYPTO_URL}/crypto/:path*`,
      },
      {
        source: '/auth',
        destination: `${AUTH_URL}/auth/`,
      },
      {
        source: '/auth/:path*',
        destination: `${AUTH_URL}/auth/:path*`,
      },
      {
        source: '/notifications',
        destination: `${NOTIFICATIONS_URL}/notifications/`,
      },
      {
        source: '/notifications/:path*',
        destination: `${NOTIFICATIONS_URL}/notifications/:path*`,
      },
      {
        source: '/email',
        destination: `${EMAIL_URL}/email/`,
      },
      {
        source: '/email/:path*',
        destination: `${EMAIL_URL}/email/:path*`,
      },
      {
        source: '/campaigns',
        destination: `${CAMPAIGNS_URL}/campaigns/`,
      },
      {
        source: '/campaigns/:path*',
        destination: `${CAMPAIGNS_URL}/campaigns/:path*`,
      },
      {
        source: '/fieldservice',
        destination: `${FIELDSERVICE_URL}/fieldservice/`,
      },
      {
        source: '/fieldservice/:path*',
        destination: `${FIELDSERVICE_URL}/fieldservice/:path*`,
      },
      {
        source: '/github',
        destination: `${GITHUB_URL}/github/`,
      },
      {
        source: '/github/:path*',
        destination: `${GITHUB_URL}/github/:path*`,
      },
      {
        source: '/jobs',
        destination: `${JOBS_URL}/jobs/`,
      },
      {
        source: '/jobs/:path*',
        destination: `${JOBS_URL}/jobs/:path*`,
      },
    ];
  };
}

module.exports = nextConfig;
