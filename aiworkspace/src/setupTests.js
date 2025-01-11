// src/setupTests.js
import '@testing-library/jest-dom';

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

global.IntersectionObserver = MockIntersectionObserver;