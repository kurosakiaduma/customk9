import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'customk9_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Handles POST requests to create a user session cookie.
 * The request body should contain the user data to be stored.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user) {
      return NextResponse.json({ message: 'User data is required' }, { status: 400 });
    }

    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, JSON.stringify(user), {
      httpOnly: false, // Allow client-side script access
      secure: process.env.NODE_ENV === 'production',
      maxAge: MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Session created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to clear the user session cookie.
 */
export async function DELETE() {
  try {
    // Clear the cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Session deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete session:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
