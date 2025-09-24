import { NextRequest, NextResponse } from 'next/server';
import { getPatientPhoto } from '@/lib/database';
import { dbReady } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbReady;
    const patientId = parseInt(params.id);
    
    if (isNaN(patientId)) {
      return new NextResponse('Invalid patient ID', { status: 400 });
    }

    const photoData = await getPatientPhoto(patientId);
    
    if (!photoData) {
      return new NextResponse('Photo not found', { status: 404 });
    }

    return new NextResponse(Buffer.from(photoData.photo), {
      headers: {
        'Content-Type': photoData.type,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error fetching patient photo:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}