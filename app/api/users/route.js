import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

const API_KEY = process.env.CLERK_SECRET_KEY;
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export async function GET(req) {
  try {
    // Get auth session
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    try {
      await limiter.check(headers(), 10, 'CACHE_TOKEN'); // 10 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Validate API key
    if (!API_KEY) {
      throw new Error('Missing API key configuration');
    }

    const response = await fetch("https://api.clerk.dev/v1/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch users: ${error}`);
    }

    const data = await response.json();
    
    // Sanitize sensitive data before sending response
    const sanitizedData = data.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses?.[0]?.emailAddress,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt
    }));

    return NextResponse.json(sanitizedData, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('[Users API Error]:', error);
    
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
