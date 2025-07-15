import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests (like your authentication)
export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const body = await request.json();
    // Await params as required by Next.js App Router
    const awaitedParams = await params;
    const path = awaitedParams.path ? awaitedParams.path.join('/') : '';
    
    // Your Odoo server URL
    const odooUrl = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.nehemiahandwilliams.com/';
    
    // Forward the request to Odoo
    const response = await fetch(`${odooUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Odoo API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests if needed
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const odooUrl = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.nehemiahandwilliams.com/';
    
    // Forward the request to Odoo
    const response = await fetch(`${odooUrl}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Odoo API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add other HTTP methods as needed (PUT, DELETE, etc.)
export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Similar implementation for PUT requests
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Similar implementation for DELETE requests
}