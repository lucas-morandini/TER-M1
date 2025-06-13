// src/config/api.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('apiConfig', () => ({
  lolesports: {
    apiKey: process.env.LOLESPORTS_API_KEY || 'myapikey',
    baseUrl: 'https://esports-api.lolesports.com/persisted/gw',
    feedUrl: 'https://feed.lolesports.com/livestats/v1',
    highlanderUrl: 'https://api.lolesports.com/api/v1',
  },
}));
