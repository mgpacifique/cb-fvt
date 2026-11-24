import { NextRequest, NextResponse } from 'next/server';
import { HdxCkanClient } from '@/lib/hdx/client';
import { HdxSearchOptions } from '@/lib/hdx/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || 'food prices';
    const country = searchParams.get('country');
    const org = searchParams.get('org') || undefined;
    const rows = parseInt(searchParams.get('rows') || '10', 10);
    const start = parseInt(searchParams.get('start') || '0', 10);

    const client = new HdxCkanClient();
    const searchOptions: HdxSearchOptions = {
      query: q,
      organization: org,
      rows,
      start,
    };

    if (country) {
      searchOptions.groups = [country];
    }

    const results = await client.searchDatasets(searchOptions);

    return NextResponse.json({
      status: 'success',
      query: q,
      totalCount: results.count,
      packages: results.packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        title: pkg.title,
        notes: pkg.notes?.slice(0, 200),
        organization: pkg.organization?.title,
        groups: pkg.groups?.map((g) => ({ name: g.name, title: g.title })),
        lastModified: pkg.metadata_modified,
        resourcesCount: pkg.resources?.length || 0,
        resources: (pkg.resources || []).map((r) => ({
          id: r.id,
          name: r.name,
          format: r.format,
          downloadUrl: r.download_url || r.url,
          size: r.size,
          lastModified: r.last_modified || r.metadata_modified,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
