import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getMonth, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import Home from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Retain the original functionality for other parts
  useNavigate: jest.fn(), // Mock useNavigate
}));

describe('Home Component', () => {
  it('redirects to the current year and month on mount', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);

    render(<Home />);

    const date = new Date();
    const expectedPath = `/${getYear(date)}/${getMonth(date) + 1}`;

    expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
  });
});
