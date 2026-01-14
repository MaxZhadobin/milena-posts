import { render, screen, fireEvent } from '@testing-library/react';
import { MessageCard } from '@/components/MessageCard';
import { describe, it, expect, vi } from 'vitest';

describe('MessageCard', () => {
  const defaultProps = {
    text: 'Test mindfulness message',
    url: 'https://t.me/c/123/1',
    onClose: vi.fn(),
  };

  it('renders the message text correctly', () => {
    render(<MessageCard {...defaultProps} />);
    expect(screen.getByText(new RegExp(defaultProps.text))).toBeInTheDocument();
  });

  it('has a functional link to the post', () => {
    render(<MessageCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: /перейти к посту/i });
    expect(link).toHaveAttribute('href', defaultProps.url);
  });

  it('calls onClose when close button is clicked', () => {
    render(<MessageCard {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /закрыть/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
