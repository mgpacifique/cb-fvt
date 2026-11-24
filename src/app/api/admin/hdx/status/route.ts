import { NextResponse } from 'next/server';
import { HdxCkanClient, HDX_DEFAULT_BASE_URL, HDX_TARGET_DATASETS } from '@/lib/hdx/client';

export async function GET() {
  const hasApiKey = !!process.env.HDX_API_KEY;
  const client = new HdxCkanClient();

  // Test connection to HDX
  const health = await client.testConnection();

  return NextResponse.json({
    status: health.success ? 'success' : 'warning',
    provider: 'Humanitarian Data Exchange (HDX) / UN OCHA',
    documentationUrl: 'https://data.humdata.org/api/3/',
    cookbookSpec: 'HDX CKAN API Cookbook (Accessing data through the CKAN API)',
    baseUrl: HDX_DEFAULT_BASE_URL,
    configuredInEnv: hasApiKey,
    authMode: hasApiKey ? 'api_key' : 'public_access',
    connection: health,
    targetDatasets: HDX_TARGET_DATASETS,
    endpoints: {
      packageSearch: `${HDX_DEFAULT_BASE_URL}/package_search`,
      packageShow: `${HDX_DEFAULT_BASE_URL}/package_show`,
      datastoreSearch: `${HDX_DEFAULT_BASE_URL}/datastore_search`,
      organizationList: `${HDX_DEFAULT_BASE_URL}/organization_list`,
      groupList: `${HDX_DEFAULT_BASE_URL}/group_list`,
    },
    timestamp: new Date().toISOString(),
  });
}
