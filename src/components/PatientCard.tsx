'use client';

import { useState } from 'react';
import { Patient } from '@/types/patient';
import styles from './PatientCard.module.css';
import ImageModal from '@/components/ImageModal';

interface PatientCardProps {
  patient: Patient;
  onUpdate?: () => void;
  expanded?: boolean; // controlled expansion
  onToggle?: (next: boolean) => void; // controlled toggle
}

export default function PatientCard({ patient, onUpdate, expanded, onToggle }: PatientCardProps) {
  const [isExpandedUncontrolled, setIsExpandedUncontrolled] = useState(false);
  const isExpanded = expanded !== undefined ? expanded : isExpandedUncontrolled;
  const [showImage, setShowImage] = useState(false);

  const toggleExpanded = () => {
    if (onToggle) {
      onToggle(!isExpanded);
    } else {
      setIsExpandedUncontrolled(!isExpanded);
    }
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.cardHeader} onClick={toggleExpanded}>

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

      <div className={`${styles.cardBody} ${isExpanded ? styles.visible : styles.hidden}`}>
        <div className={styles.divider}></div>
        
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone</span>
            <span className={styles.detailValue}>
              {patient.phoneCountryCode} {patient.phoneNumber}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>{patient.email}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Document</span>
            <span className={styles.detailValue}>
              {patient.hasPhoto ? (
                <a
                  href={`/api/patients/${patient.id}/photo`}
                  className={styles.documentLink}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowImage(true);
                  }}
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
      <ImageModal
        show={showImage}
        onClose={() => setShowImage(false)}
        imageUrl={`/api/patients/${patient.id}/photo`}
        alt={`Document for ${patient.fullName}`}
        title={`${patient.fullName} - Document`}
      />
    </div>
  );
}