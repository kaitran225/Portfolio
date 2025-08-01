import emailjs from '@emailjs/browser';

// EmailJS Configuration
// To set up:
// 1. Create account at https://www.emailjs.com/
// 2. Create email service (Gmail, Outlook, etc.)
// 3. Create email template
// 4. Get your public key from dashboard
const EMAIL_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_portfolio',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_portfolio',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key_here',
  autoReplyTemplateId: process.env.REACT_APP_EMAILJS_AUTO_REPLY_TEMPLATE_ID || 'template_auto_reply'
};

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  phone?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

class EmailService {
  private isInitialized = false;

  constructor() {
    this.initializeEmailJS();
  }

  private initializeEmailJS() {
    try {
      emailjs.init(EMAIL_CONFIG.publicKey);
      this.isInitialized = true;
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      this.isInitialized = false;
    }
  }

  async sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        message: 'Email service not initialized',
        error: 'EmailJS configuration missing'
      };
    }

    try {
      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not specified',
        subject: formData.subject || 'Portfolio Contact',
        message: formData.message,
        project_type: formData.projectType || 'General Inquiry',
        budget: formData.budget || 'Not specified',
        timeline: formData.timeline || 'Not specified',
        phone: formData.phone || 'Not provided',
        to_name: 'Kai Tran',
        to_email: 'contact@kaitran.dev',
        reply_to: formData.email,
        timestamp: new Date().toLocaleString()
      };

      // Send main email
      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams
      );

      if (response.status === 200) {
        // Send auto-reply email
        await this.sendAutoReply(formData);
        
        return {
          success: true,
          message: 'Message sent successfully! I\'ll get back to you soon.'
        };
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Email send error:', error);
      
      return {
        success: false,
        message: 'Failed to send message. Please try again or contact me directly.',
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  private async sendAutoReply(formData: ContactFormData): Promise<void> {
    try {
      const autoReplyParams = {
        to_name: formData.name,
        to_email: formData.email,
        from_name: 'Kai Tran',
        from_email: 'contact@kaitran.dev',
        subject: 'Thank you for contacting me!',
        project_type: formData.projectType || 'General Inquiry',
        timestamp: new Date().toLocaleString()
      };

      await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.autoReplyTemplateId,
        autoReplyParams
      );
    } catch (error) {
      console.error('Auto-reply send error:', error);
      // Don't throw error for auto-reply failure
    }
  }

  async sendProjectInquiry(formData: ContactFormData & { 
    projectDetails: string;
    technicalRequirements?: string;
    designPreferences?: string;
  }): Promise<EmailResponse> {
    const enhancedFormData = {
      ...formData,
      subject: `Project Inquiry: ${formData.projectType}`,
      message: `
Project Details:
${formData.projectDetails}

Technical Requirements:
${formData.technicalRequirements || 'Not specified'}

Design Preferences:
${formData.designPreferences || 'Not specified'}

Additional Message:
${formData.message}
      `.trim()
    };

    return this.sendContactEmail(enhancedFormData);
  }

  async sendCollaborationRequest(formData: ContactFormData & {
    collaborationType: string;
    organizationSize?: string;
    projectDuration?: string;
  }): Promise<EmailResponse> {
    const collaborationFormData = {
      ...formData,
      subject: `Collaboration Request: ${formData.collaborationType}`,
      message: `
Collaboration Type: ${formData.collaborationType}
Organization Size: ${formData.organizationSize || 'Not specified'}
Project Duration: ${formData.projectDuration || 'Not specified'}

Message:
${formData.message}
      `.trim()
    };

    return this.sendContactEmail(collaborationFormData);
  }

  // Method to test email configuration
  async testEmailConfiguration(): Promise<EmailResponse> {
    const testData: ContactFormData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Email Configuration Test',
      message: 'This is a test message to verify EmailJS configuration.',
      projectType: 'Test'
    };

    return this.sendContactEmail(testData);
  }

  // Get configuration status
  getConfigurationStatus(): {
    isConfigured: boolean;
    serviceId: string;
    templateId: string;
    publicKey: string;
    missingKeys: string[];
  } {
    const missingKeys = [];
    
    if (!EMAIL_CONFIG.serviceId || EMAIL_CONFIG.serviceId === 'service_portfolio') {
      missingKeys.push('REACT_APP_EMAILJS_SERVICE_ID');
    }
    
    if (!EMAIL_CONFIG.templateId || EMAIL_CONFIG.templateId === 'template_portfolio') {
      missingKeys.push('REACT_APP_EMAILJS_TEMPLATE_ID');
    }
    
    if (!EMAIL_CONFIG.publicKey || EMAIL_CONFIG.publicKey === 'your_public_key_here') {
      missingKeys.push('REACT_APP_EMAILJS_PUBLIC_KEY');
    }

    return {
      isConfigured: missingKeys.length === 0,
      serviceId: EMAIL_CONFIG.serviceId,
      templateId: EMAIL_CONFIG.templateId,
      publicKey: EMAIL_CONFIG.publicKey.substring(0, 8) + '...',
      missingKeys
    };
  }
}

// Create and export singleton instance
export const emailService = new EmailService();

// Export default for convenience
export default emailService;

// Email template examples for EmailJS setup:
/*
Main Contact Template:
Subject: New Portfolio Contact from {{from_name}}

Hello Kai,

You've received a new message through your portfolio:

Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Project Type: {{project_type}}
Budget: {{budget}}
Timeline: {{timeline}}
Phone: {{phone}}

Message:
{{message}}

Sent at: {{timestamp}}

---
Auto-Reply Template:
Subject: Thank you for contacting me!

Hi {{to_name}},

Thank you for reaching out through my portfolio! I've received your message regarding "{{project_type}}" and I'll get back to you within 24 hours.

In the meantime, feel free to:
- Check out my latest projects on GitHub
- Connect with me on LinkedIn
- Schedule a call if it's urgent

Best regards,
Kai Tran
Full-Stack Developer
contact@kaitran.dev

Sent at: {{timestamp}}
*/
