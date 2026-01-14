import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Telegram WebApp
(window as any).Telegram = {
  WebApp: {
    ready: vi.fn(),
    expand: vi.fn(),
    initData: 'query_id=123&user=%7B%22id%22%3A123%2C%22first_name%22%3A%22Test%22%7D&hash=abc',
    HapticFeedback: {
      impactOccurred: vi.fn(),
    },
  },
};
