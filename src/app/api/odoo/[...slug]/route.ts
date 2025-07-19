// src/app/api/odoo/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleRequest(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  // In recent Next.js versions, we need to ensure the request stream is consumed
  // before accessing dynamic route parameters to avoid race conditions.
  let body: any = null;
  // For methods with a body, we must read it to make `params` available.
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.json();
    } catch (e) {
      // It's possible the body is empty or not JSON, so we ignore errors.
    }
  }

  const ODOO_BASE_URL = process.env.NEXT_PUBLIC_ODOO_BASE_URL;

  if (!ODOO_BASE_URL) {
    console.error('[API Proxy] ODOO_BASE_URL is not set.');
    return NextResponse.json(
      { message: 'Odoo base URL is not configured.' },
      { status: 500 }
    );
  }

  const slug = params.slug;
  const odooApiPath = slug.join('/');
  
  // Ensure no double slashes in the final URL
  const cleanedBaseUrl = ODOO_BASE_URL.endsWith('/') ? ODOO_BASE_URL.slice(0, -1) : ODOO_BASE_URL;
  const odooApiUrl = `${cleanedBaseUrl}/${odooApiPath}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.set('host', new URL(ODOO_BASE_URL).host);

  console.log(`[API Proxy] Forwarding request to: ${req.method} ${odooApiUrl}`);
  
  try {
    // Conditionally set the body only for relevant methods
    const bodyToSend = body ? JSON.stringify(body) : undefined;

    const response = await fetch(odooApiUrl, {
      method: req.method,
      headers,
      body: bodyToSend,
      redirect: 'follow',
      // @ts-ignore
      duplex: 'half', // Required for streaming request body in some environments
    });

    // Forward the response from Odoo back to the client
    const responseHeaders = new Headers(response.headers);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[API Proxy] Error forwarding to ${odooApiUrl}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'API proxy error', error: errorMessage }, { status: 502 });
  }
}

// Explicitly export async handlers for each method
export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return handleRequest(req, { params });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return handleRequest(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return handleRequest(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return handleRequest(req, { params });
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return handleRequest(req, { params });
}