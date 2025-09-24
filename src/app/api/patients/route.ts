import { NextRequest, NextResponse } from 'next/server';
import { createPatient, getPatients } from '@/lib/database';
import { dbReady } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    await dbReady;
    const formData = await request.formData();
    
    const patientData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phoneCountryCode: formData.get('phoneCountryCode') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    let documentPhoto = undefined;
    const photoFile = formData.get('documentPhoto') as File | null;
    
    if (photoFile && photoFile.size > 0) {
      const bytes = await photoFile.arrayBuffer();
      documentPhoto = Buffer.from(bytes);
    }

    const patient = await createPatient({
      ...patientData,
      documentPhoto
    });

    return NextResponse.json(
      { 
        success: true, 
        patient: patient,
        message: 'Patient registered successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError' || 
        (error.errors && error.errors.some((e: any) => e.path === 'email')) ||
        error.message?.includes('unique constraint')) {
      
      return NextResponse.json(
        { success: false, error: 'A patient with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbReady;
    const patients = await getPatients();
    return NextResponse.json({
      success: true,
      patients: patients
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}