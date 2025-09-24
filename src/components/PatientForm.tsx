'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { CreatePatientRequest } from '@/types/patient';
import { COUNTRY_DIAL_CODES } from '@/lib/countryCodes';
import styles from './PatientForm.module.css';

interface PatientFormProps {
  onSubmit: (data: CreatePatientRequest) => void;
  submitting: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  documentPhoto?: string;
}

export default function PatientForm({ onSubmit, submitting }: PatientFormProps) {
  const [formData, setFormData] = useState<CreatePatientRequest>({
    fullName: '',
    email: '',
    phoneCountryCode: '+598',
    phoneNumber: '',
    documentPhoto: null as any,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isCountryCodeMenuOpen, setIsCountryCodeMenuOpen] = useState(false);
  const countryCodeWrapperRef = useRef<HTMLDivElement | null>(null);

  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Full name should only contain letters and spaces';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!value.endsWith('@gmail.com')) return 'Email must be a @gmail.com address';
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;

      case 'phoneCountryCode':
        if (!value) return 'Country code is required';
        if (!/^\+\d{1,4}$/.test(value)) return 'Country code must be in format +XXX';
        return undefined;

      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d+$/.test(value.replace(/\s/g, ''))) return 'Phone number must contain only numbers';
        if (value.replace(/\s/g, '').length < 6) return 'Phone number must be at least 6 digits';
        if (value.replace(/\s/g, '').length > 20) return 'Phone number must be at most 20 digits';
        return undefined;

      case 'documentPhoto':
        if (!value) return 'Document photo is required';
        if (!value.type.includes('jpeg') && !value.type.includes('jpg')) {
          return 'Document photo must be a .jpg file';
        }
        if (value.size > 5 * 1024 * 1024) return 'Document photo must be smaller than 5MB';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    newErrors.fullName = validateField('fullName', formData.fullName);
    newErrors.email = validateField('email', formData.email);
    newErrors.phoneCountryCode = validateField('phoneCountryCode', formData.phoneCountryCode);
    newErrors.phoneNumber = validateField('phoneNumber', formData.phoneNumber);
    newErrors.documentPhoto = validateField('documentPhoto', formData.documentPhoto);

    return newErrors;
  };

  const getCountryCodeLabel = (code: string): string => {
    const match = COUNTRY_DIAL_CODES.find(c => c.code === code);
    return match ? `${match.name} (${match.code})` : code;
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isCountryCodeMenuOpen) return;
      if (countryCodeWrapperRef.current && !countryCodeWrapperRef.current.contains(event.target as Node)) {
        setIsCountryCodeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCountryCodeMenuOpen]);

  const handleInputChange = (field: keyof CreatePatientRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (showErrors) {
      const fieldError = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleInputChange('documentPhoto', file);
    }
  }, [showErrors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    setShowErrors(true);

    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Full Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={`${styles.input} ${errors.fullName && showErrors ? styles.inputError : ''}`}
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter patient's full name"
          disabled={submitting}
        />
        {errors.fullName && showErrors && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {errors.fullName}
          </div>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Email Address <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          className={`${styles.input} ${errors.email && showErrors ? styles.inputError : ''}`}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="patient@gmail.com"
          disabled={submitting}
        />
        {errors.email && showErrors && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {errors.email}
          </div>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Phone Number <span className={styles.required}>*</span>
        </label>
        <div className={styles.phoneGroup}>
          <div className={`${styles.countryCodeWrapper}`} ref={countryCodeWrapperRef}>
            <button
              type="button"
              className={`${styles.select} ${styles.countryCode} ${styles.dropdownToggle} ${errors.phoneCountryCode && showErrors ? styles.inputError : ''}`}
              onClick={() => setIsCountryCodeMenuOpen(prev => !prev)}
              disabled={submitting}
              aria-haspopup="listbox"
              aria-expanded={isCountryCodeMenuOpen}
            >
              <span>{getCountryCodeLabel(formData.phoneCountryCode)}</span>
              <span className={styles.dropdownCaret}>▾</span>
            </button>

            {isCountryCodeMenuOpen && (
              <div className={styles.dropdownMenu} role="listbox">
                {COUNTRY_DIAL_CODES.map(({ name, code }) => (
                  <div
                    key={`${name}-${code}`}
                    role="option"
                    aria-selected={formData.phoneCountryCode === code}
                    className={styles.dropdownItem}
                    onClick={() => {
                      handleInputChange('phoneCountryCode', code);
                      setIsCountryCodeMenuOpen(false);
                    }}
                  >
                    {name} ({code})
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="tel"
            className={`${styles.input} ${styles.phoneInput} ${errors.phoneNumber && showErrors ? styles.inputError : ''}`}
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="99 123 456"
            disabled={submitting}
          />
        </div>
        {(errors.phoneCountryCode || errors.phoneNumber) && showErrors && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {errors.phoneCountryCode || errors.phoneNumber}
          </div>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Document Photo <span className={styles.required}>*</span>
        </label>
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${isDragActive || dragActive ? styles.dropzoneActive : ''} ${errors.documentPhoto && showErrors ? styles.dropzoneError : ''}`}
        >
          <input {...getInputProps()} disabled={submitting} />
          
          {formData.documentPhoto ? (
            <div className={styles.fileSelected}>
              <span className={styles.fileIcon}>📄</span>
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{formData.documentPhoto.name}</p>
              </div>
              <button
                type="button"
                className={styles.removeFile}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInputChange('documentPhoto', null);
                }}
                disabled={submitting}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className={styles.dropzoneContent}>
              <span className={styles.uploadIcon}>📁</span>
              <p className={styles.dropzoneText}>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p className={styles.dropzoneSubtext}>
                JPG files only, max 5MB
              </p>
            </div>
          )}
        </div>
        {errors.documentPhoto && showErrors && (
          <div className={styles.errorMessage}>
            {errors.documentPhoto}
          </div>
        )}
      </div>

      <div className={styles.submitSection}>
        <button
          type="submit"
          className={`${styles.submitButton} ${submitting ? styles.submitting : ''}`}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className={styles.spinner}></span>
              Registering Patient...
            </>
          ) : (
            'Register Patient'
          )}
        </button>
      </div>
    </form>
  );
}