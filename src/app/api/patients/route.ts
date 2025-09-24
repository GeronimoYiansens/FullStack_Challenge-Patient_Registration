import { createPatient, getPatients } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const patientData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phoneCountryCode: formData.get('phoneCountryCode') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    if (!patientData.fullName || !patientData.email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const patient = await createPatient(patientData);

    return NextResponse.json(
      { 
        success: true, 
        patient: patient,
        message: 'Patient registered successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Database error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError' || 
        (error.errors && error.errors.some((e: any) => e.path === 'email')) ||
        error.message?.includes('unique constraint')) {
      
      return NextResponse.json(
        { success: false, error: 'A patient with this email already exists' },
        { status: 409 }
      );
    }
  
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
    const patients = await getPatients();
  try {
    return NextResponse.json({
      success: true,
      patients: patients
    });

  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}