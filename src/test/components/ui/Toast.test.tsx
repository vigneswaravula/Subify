import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, showToast } from '../../../components/ui/Toast';

describe('Toast Component', () => {
  it('renders toast provider without crashing', () => {
    render(<ToastProvider />);
  });

  it('shows success toast', () => {
    render(<ToastProvider />);
    
    showToast.success('Test success message');
    
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });

  it('shows error toast', () => {
    render(<ToastProvider />);
    
    showToast.error('Test error message');
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('allows dismissing toast', () => {
    render(<ToastProvider />);
    
    showToast.info('Test dismissible message');
    
    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);
    
    // Toast should be removed after clicking dismiss
    expect(screen.queryByText('Test dismissible message')).not.toBeInTheDocument();
  });
});