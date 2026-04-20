const FRED_KEY = '2104fc28780195912aecafafc36afa9d';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.searchParams;

    if (path === '/fred') {
      const series = params.get('series_id');
      const limit = params.get('limit') || '2';
      const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&sort_order=desc&limit=${limit}&file_type=json&api_key=${FRED_KEY}`;
      const resp = await fetch(fredUrl);
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/fx') {
      const from = params.get('from');
      const to = params.get('to');
      const date = params.get('date') || 'latest';
      const fxUrl = `https://api.frankfurter.app/${date}?from=${from}&to=${to}`;
      const resp = await fetch(fxUrl);
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404, headers: CORS });
  }
};
