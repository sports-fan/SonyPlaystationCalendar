import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Calendar from './index';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    year: '2024',
    month: '1'
  }),
  useNavigate: () => jest.fn(),
}));

const renderWithRouter = (component) => {
  return { ...render(<BrowserRouter>{component}</BrowserRouter>) }
}

describe('Calendar Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: 
      {
        id: "18213007415c6b3aceb83604",
        launchDate: "2024-09-13T09:01:30.152Z",
        title: "Gran Turismo 7",
        summary: "Gran Turismo 7 brings together the very best features of the Real Driving Simulator. Whether you’re a competitive or casual racer, collector, tuner, livery designer or photographer – find your line with a staggering collection of game modes including fan-favorites like GT Campaign, Arcade and Driving School.",
        imageFilenameThumb: "gran-turismo-7__1x1",
        imageFilenameFull: "gran-turismo-7__16x9",
        learnMoreLink: "https://www.playstation.com/en-us/games/gran-turismo-7/",
        purchaseLink: "https://www.playstation.com/en-us/games/gran-turismo-7/#buy-now"
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the calendar grid', () => {
    renderWithRouter(<Calendar />);
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
  });

  it('shows event details when a day with an event is clicked', async () => {
    renderWithRouter(<Calendar />);
    const dayWithEvent = screen.getByText('15'); // assuming day 15 has an event
    fireEvent.click(dayWithEvent);
    
    expect(screen.getByText('Event Details')).toBeInTheDocument();
  });

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
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { launchDate: '2023-10-15', title: 'SpaceX Launch', summary: 'A mission to Mars.', imageFilenameFull: 'spacex-full' }
    });

    renderWithRouter(<Calendar />, { route: '/2023/10' });

    await waitFor(() => screen.getByText('SpaceX Launch'));

    fireEvent.click(screen.getByText('15'));

    await waitFor(() => {
      expect(screen.getByText('A mission to Mars.')).toBeInTheDocument();
    });
  });

  it('navigates to the next and previous month', () => {
    const { getByText } = renderWithRouter(<Calendar />, { route: '/2023/10' });

    fireEvent.click(getByText('❯'));
    expect(getByText('November 2023')).toBeInTheDocument()

    fireEvent.click(getByText('❮')); // Click previous month button
    expect(getByText('October 2023')).toBeInTheDocument(); // Expect to return to the original month
  });
});
