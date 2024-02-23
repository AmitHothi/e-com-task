/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
        MAINTENANCE_MODE_ENABLED: process.env.MAINTENANCE_MODE_ENABLED,
      },
      images:{
        // domains:["https://99b8-2409-40c1-10db-e808-1017-f4ce-7886-e33d.ngrok-free.app"],  
        remotePatterns: [
        {
          protocol: 'https',
          hostname: '70ef-2409-4080-9c90-d54d-742d-c370-978f-fd21.ngrok-free.app',
          port: '',
          pathname: '/images/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '1803',
          pathname: '/images/**',
        }
      ],
  
      },
    webpack: (config) => {
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        });
        return config;
      },
}

module.exports = nextConfig
