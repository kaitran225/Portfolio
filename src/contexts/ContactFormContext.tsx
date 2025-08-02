import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContactFormContextType {
  showContactForm: boolean;
  openContactForm: () => void;
  closeContactForm: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export const useContactForm = () => {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error('useContactForm must be used within a ContactFormProvider');
  }
  return context;
};

interface ContactFormProviderProps {
  children: ReactNode;
}

export const ContactFormProvider: React.FC<ContactFormProviderProps> = ({ children }) => {
  const [showContactForm, setShowContactForm] = useState(false);

  const openContactForm = () => setShowContactForm(true);
  const closeContactForm = () => setShowContactForm(false);

  const value: ContactFormContextType = {
    showContactForm,
    openContactForm,
    closeContactForm,
  };

  return (
    <ContactFormContext.Provider value={value}>
      {children}
    </ContactFormContext.Provider>
  );
};
