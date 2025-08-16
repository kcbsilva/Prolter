// src/app/api/client/auth/direct-login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taxNumber } = body;

    // Basic validation
    if (!taxNumber || typeof taxNumber !== 'string') {
      return NextResponse.json(
        { error: 'Tax number is required' },
        { status: 400 }
      );
    }

    const cleanTaxNumber = taxNumber.trim();
    if (cleanTaxNumber.length < 3) {
      return NextResponse.json(
        { error: 'Please enter a valid tax number' },
        { status: 400 }
      );
    }

    // For now, just return success with a mock client ID
    // This will allow the frontend to redirect to the dashboard
    const mockClientId = 123; // You can use any ID for now

    return NextResponse.json({
      success: true,
      id: mockClientId,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Direct login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}