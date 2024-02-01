import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Calendar from './Calendar'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock modules
jest.mock('axios');

// Utility function to render the component within a Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('Calendar Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Calendar />, { route: '/2023/10' });
    expect(screen.getByText(/current month/i)).toBeInTheDocument();
  });

  // Assuming the component automatically navigates to a valid date
  it('navigates to a valid date and updates the display', () => {
    const { getByText } = renderWithRouter(<Calendar />, { route: '/2023/11' });
    expect(getByText('November 2023')).toBeInTheDocument();
  });

  it('handles invalid dates by showing an error or redirecting', () => {
    renderWithRouter(<Calendar />, { route: '/2023/13' }); // Invalid month
    expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
  });

  it('fetches and displays events correctly', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { launchDate: '2023-10-15', title: 'SpaceX Launch', imageFilenameThumb: 'spacex-launch' }
    });
  
    renderWithRouter(<Calendar />, { route: '/2023/10' });
  
    await waitFor(() => {
      expect(screen.getByText('SpaceX Launch')).toBeInTheDocument();
      expect(screen.getByAltText('thumb')).toHaveAttribute('src', '/images/spacex-launch.webp');
    });
  });

  it('displays event detail when an event day is clicked', async () => {
    // Prepopulate the events state as if fetched successfully
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { launchDate: '2023-10-15', title: 'SpaceX Launch', summary: 'A mission to Mars.', imageFilenameFull: 'spacex-full' }
    });

    renderWithRouter(<Calendar />, { route: '/2023/10' });

    await waitFor(() => screen.getByText('SpaceX Launch')); // Wait for the event to be displayed

    fireEvent.click(screen.getByText('15')); // Simulate clicking on the day of the event

    await waitFor(() => {
      expect(screen.getByText('A mission to Mars.')).toBeInTheDocument();
    });
  });

  it('navigates to the next and previous month', () => {
    const { getByText } = renderWithRouter(<Calendar />, { route: '/2023/10' });

    fireEvent.click(getByText('❯')); // Click next month button
    expect(getByText('November 2023')).toBeInTheDocument(); // Expect next month to be displayed

    fireEvent.click(getByText('❮')); // Click previous month button
    expect(getByText('October 2023')).toBeInTheDocument(); // Expect to return to the original month
  });
});
