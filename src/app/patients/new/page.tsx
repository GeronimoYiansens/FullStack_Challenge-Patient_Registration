'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PatientForm from '@/components/PatientForm';
import Modal from '@/components/Modal';
import { CreatePatientRequest } from '@/types/patient';
import styles from './newPatient.module.css';

export default function NewPatientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (data: CreatePatientRequest) => {
    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phoneCountryCode', data.phoneCountryCode);
      formData.append('phoneNumber', data.phoneNumber);
      if (data.documentPhoto) {
        formData.append('documentPhoto', data.documentPhoto);
      }

      const response = await fetch('/api/patients', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setModalState('success');
        setModalMessage(`Patient ${data.fullName} registered successfully!`);
        setShowModal(true);
      } else {
        setModalState('error');
        setModalMessage(result.error || 'Failed to register patient');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error submitting patient:', error);
      setModalState('error');
      setModalMessage('Network error. Please check your connection and try again.');
      setShowModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    
    if (modalState === 'success') {
      router.push('/patients');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <nav className={styles.breadcrumb}>
          <Link href="/patients" className={styles.breadcrumbLink}>
            ← Back to Patients
          </Link>
        </nav>

        <div className={styles.header}>
          <h1 className={styles.title}>Register New Patient</h1>
          <p className={styles.subtitle}>
            Fill in the patient information below. All fields are required.
          </p>
        </div>

        <PatientForm 
          onSubmit={handleSubmit} 
          submitting={submitting}
        />
      </div>

      <Modal
        show={showModal}
        onClose={handleModalClose}
        type={modalState}
        title={modalState === 'success' ? '✅ Success!' : '❌ Error'}
        message={modalMessage}
        primaryButtonText={modalState === 'success' ? 'View Patients' : 'Try Again'}
        secondaryButtonText={modalState === 'success' ? undefined : 'Cancel'}
      />
    </div>
  );
}