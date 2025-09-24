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

  } catch (error) {
    console.error('Error creating patient:', error);
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