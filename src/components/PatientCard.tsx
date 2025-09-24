'use client';

import { useState } from 'react';
import { Patient } from '@/types/patient';
import styles from './PatientCard.module.css';

interface PatientCardProps {
  patient: Patient;
  onUpdate?: () => void;
}

export default function PatientCard({ patient, onUpdate }: PatientCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      {/* Siempre visible - Nombre y foto */}
      <div className={styles.cardHeader} onClick={toggleExpanded}>
        <div className={styles.patientPhoto}>
          {patient.documentPhotoPath ? (
            <img 
              src={patient.documentPhotoPath} 
              alt={`${patient.fullName} document`}
              className={styles.documentImage}
            />
          ) : (
            <div className={styles.placeholderPhoto}>
              <span className={styles.photoIcon}>📄</span>
              <span className={styles.photoText}>No photo</span>
            </div>
          )}
        </div>
        
        <div className={styles.patientInfo}>
          <h3 className={styles.patientName}>{patient.fullName}</h3>
          <p className={styles.patientEmail}>{patient.email}</p>
        </div>

        <div className={styles.expandIcon}>
          <span className={`${styles.arrow} ${isExpanded ? styles.arrowUp : styles.arrowDown}`}>
            ⌄
          </span>
        </div>
      </div>

      {/* Expandible - Resto de información */}
      <div className={`${styles.cardBody} ${isExpanded ? styles.visible : styles.hidden}`}>
        <div className={styles.divider}></div>
        
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>📞 Phone</span>
            <span className={styles.detailValue}>
              {patient.phoneCountryCode} {patient.phoneNumber}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>📧 Email</span>
            <span className={styles.detailValue}>{patient.email}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>🆔 Patient ID</span>
            <span className={styles.detailValue}>#{patient.id}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>📋 Document</span>
            <span className={styles.detailValue}>
              {patient.documentPhotoPath ? (
                <a 
                  href={patient.documentPhotoPath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.documentLink}
                >
                  View Document
                </a>
              ) : (
                'No document uploaded'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}