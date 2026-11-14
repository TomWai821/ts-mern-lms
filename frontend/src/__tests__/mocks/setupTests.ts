import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

(global as any).fetch = jest.fn();