'use client';

import { useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export default function Modal({
  show,
  onClose,
  type,
  title,
  message,
  primaryButtonText = 'OK',
  secondaryButtonText
}: ModalProps) {
  
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  // Prevenir scroll del body cuando modal está abierto
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`${styles.backdrop} ${show ? styles.backdropVisible : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modal} ${styles[type]} ${show ? styles.modalVisible : ''}`}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            {type === 'success' ? (
              <div className={styles.successIcon}>
                <div className={styles.checkmark}>
                  <div className={styles.checkmarkStem}></div>
                  <div className={styles.checkmarkKick}></div>
                </div>
              </div>
            ) : (
              <div className={styles.errorIcon}>
                <span className={styles.errorX}>✕</span>
              </div>
            )}
          </div>
          
          <p className={styles.modalMessage}>{message}</p>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button
            className={`${styles.button} ${styles.primaryButton} ${styles[type + 'Button']}`}
            onClick={onClose}
          >
            {primaryButtonText}
          </button>
          
          {secondaryButtonText && (
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={onClose}
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}