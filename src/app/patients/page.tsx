'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Patient } from '@/types/patient';
import PatientCard from '@/components/PatientCard';
import styles from './patients.module.css';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/patients');
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.patients || []);
      } else {
        setError(data.error || 'Error fetching patients');
      }
    } catch (err) {
      setError('Network error - could not fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1 className={styles.title}>Patients</h1>
          <div className={styles.errorMessage}>
            <p>❌ {error}</p>
            <button 
              onClick={fetchPatients}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Patients</h1>
        <Link 
          href="/patients/new"
          className={styles.addButton}
        >
          Add Patient
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h2 className={styles.emptyTitle}>No patients registered yet</h2>
          <p className={styles.emptyDescription}>
            Start by registering your first patient
          </p>
          <Link 
            href="/patients/new"
            className={styles.primaryButton}
          >
            Register First Patient
          </Link>
        </div>
      ) : (
        <div className={styles.patientsGrid}>
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onUpdate={fetchPatients}
            />
          ))}
        </div>
      )}
    </div>
  );
}