'use client';

import { useEffect } from 'react';
import styles from './ImageModal.module.css';

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
  title?: string;
}

export default function ImageModal({ show, onClose, imageUrl, alt = 'Document image', title = 'Document' }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

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
      <div className={`${styles.modal} ${show ? styles.modalVisible : ''}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close image"
          >
            ✕
          </button>
        </div>

        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={alt} className={styles.image} />
        </div>
      </div>
    </div>
  );
}


