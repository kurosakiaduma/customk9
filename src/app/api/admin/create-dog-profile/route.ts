import { NextRequest, NextResponse } from 'next/server';
import ServiceFactory from '@/services/ServiceFactory';
import { Dog } from '@/types/dog';

/**
 * SERVER-SIDE ROUTE for creating a dog profile with admin privileges.
 * This route can safely access server-only environment variables for Odoo admin credentials.
 */
export async function POST(req: NextRequest) {
  try {
    const { partner_id, dogData } = (await req.json()) as { partner_id: number; dogData: Partial<Dog> };

    if (!partner_id || !dogData) {
      return NextResponse.json({ message: 'Missing partner_id or dogData' }, { status: 400 });
    }

    console.log(`[API Route - Admin] Received request to create dog for partner ID: ${partner_id}`);

    // Get a server-side instance of the Odoo service
    const odooService = ServiceFactory.getInstance().getOdooClientService();

    // This call will now execute on the server, using the server-side jsonRpcAdmin method
    const newDogId = await odooService._createDogProfileWithAdmin(partner_id, dogData);

    return NextResponse.json({ dogId: newDogId }, { status: 201 });

  } catch (error) {
    console.error('[API Route - Admin Error] Failed to create dog profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to create dog profile.', error: errorMessage }, { status: 500 });
  }
}
