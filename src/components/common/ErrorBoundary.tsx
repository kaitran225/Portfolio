import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiMail } from './IconWrapper';

// ============= ERROR BOUNDARY COMPONENT =============

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to analytics if available
    try {
      const analytics = (window as any).analytics;
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent({
          name: 'error_boundary_triggered',
          category: 'error',
          properties: {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
          }
        });
      }
    } catch (e) {
      console.warn('Failed to log error to analytics:', e);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReport = () => {
    const subject = `Portfolio Error Report`;
    const body = `
Error: ${this.state.error?.message}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}

Browser: ${navigator.userAgent}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `;
    
    const mailtoLink = `mailto:kharl.samson@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon>
              <FiAlertTriangle />
            </ErrorIcon>
            
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We encountered an unexpected error while loading the portfolio. 
              This has been logged and will be investigated.
            </ErrorMessage>

            <ErrorActions>
              <ErrorAction onClick={this.handleReload} $primary>
                <FiRefreshCw />
                Reload Page
              </ErrorAction>
              
              <ErrorAction onClick={this.handleGoHome}>
                <FiHome />
                Go Home
              </ErrorAction>
              
              <ErrorAction onClick={this.handleReport}>
                <FiMail />
                Report Issue
              </ErrorAction>
            </ErrorActions>

            {process.env.NODE_ENV === 'development' && (
              <ErrorDetails>
                <DetailsTitle>Error Details (Development Mode)</DetailsTitle>
                <ErrorCode>
                  <strong>Error:</strong> {this.state.error?.message}
                </ErrorCode>
                <ErrorCode>
                  <strong>Stack:</strong>
                  <pre>{this.state.error?.stack}</pre>
                </ErrorCode>
                {this.state.errorInfo && (
                  <ErrorCode>
                    <strong>Component Stack:</strong>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </ErrorCode>
                )}
              </ErrorDetails>
            )}
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Styled Components
const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-primary);
  padding: 2rem;
`;

const ErrorContent = styled.div`
  max-width: 600px;
  text-align: center;
  background: var(--background-secondary);
  border-radius: 16px;
  padding: 3rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-large);
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const ErrorTitle = styled.h1`
  color: var(--color-text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const ErrorAction = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${props => props.$primary ? 'var(--color-purple-primary)' : 'var(--border-color)'};
  background: ${props => props.$primary ? 'var(--color-purple-primary)' : 'var(--background-tertiary)'};
  color: ${props => props.$primary ? 'white' : 'var(--color-text-primary)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-purple-primary);
    color: white;
    border-color: var(--color-purple-primary);
    transform: translateY(-2px);
  }
`;

const ErrorDetails = styled.div`
  text-align: left;
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const DetailsTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ErrorCode = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  strong {
    color: var(--color-text-primary);
  }
  
  pre {
    background: var(--background-primary);
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'Fira Code', 'Monaco', 'Menlo', monospace;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

export default ErrorBoundary;
