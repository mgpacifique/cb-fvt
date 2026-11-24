import { NextResponse } from 'next/server';

export async function GET() {
  const hasEnvToken = !!process.env.FEWSNET_API_TOKEN;
  const hasEnvCredentials = !!(process.env.FEWSNET_USERNAME && process.env.FEWSNET_PASSWORD);

  return NextResponse.json({
    status: 'success',
    provider: 'FEWS NET Data Warehouse (FDW)',
    swaggerDocumentation: 'https://fdw.fews.net/api/schema/swagger-ui/',
    authEndpoint: 'https://fdw.fews.net/api-token-auth/',
    endpoints: {
      marketPrices: 'https://fdw.fews.net/api/marketpricefacts/',
      tradeFlows: 'https://fdw.fews.net/api/tradeflowquantityvalue/',
      marketProducts: 'https://fdw.fews.net/api/marketproduct/',
      geographicUnits: 'https://fdw.fews.net/api/geographicunit/',
      ipcPhase: 'https://fdw.fews.net/api/ipcphase/',
    },
    configuredInEnv: hasEnvToken || hasEnvCredentials,
    configuredUsername: process.env.FEWSNET_USERNAME || null,
    authMode: hasEnvToken ? 'jwt_token' : hasEnvCredentials ? 'credentials' : 'public_unauthenticated',
    timestamp: new Date().toISOString(),
  });
}
