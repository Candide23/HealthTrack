import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HealthMetric from '../HealthMetric.jsx';
import { HealthMetricAPI } from '../../../services/api';

// Mock API calls
jest.mock('../../../services/api', () => ({
  HealthMetricAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('HealthMetric Component', () => {
  beforeEach(() => {
    HealthMetricAPI.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          metricType: 'Weight',
          value: 75,
          timestamp: '2024-09-23T10:30'
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders health metric form and table correctly', async () => {
    render(<HealthMetric />);

    // Check that the form inputs are rendered
    expect(screen.getByLabelText(/Metric Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Value/i)).toBeInTheDocument();

    // Check that the table headers are rendered
    expect(await screen.findByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Verify the health metric data in the table
    expect(await screen.findByText(/Weight/)).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  test('handles form submission correctly for adding a new health metric', async () => {
    HealthMetricAPI.create.mockResolvedValueOnce({
      data: {
        id: 2,
        metricType: 'Height',
        value: 180,
        timestamp: '2024-09-23T11:00'
      }
    });

    render(<HealthMetric />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Metric Type/i), {
      target: { value: 'Height' }
    });
    fireEvent.change(screen.getByLabelText(/Value/i), {
      target: { value: '180' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add Metric/i));

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(HealthMetricAPI.create).toHaveBeenCalledWith({
        metricType: 'Height',
        value: 180,
        timestamp: expect.any(String),
        user: { id: localStorage.getItem('userId') }
      });
    });

    // Verify that the newly added health metric is shown in the table
    expect(await screen.findByText('Height')).toBeInTheDocument();
    expect(screen.getByText('180')).toBeInTheDocument();
  });

  test('handles editing a health metric', async () => {
    HealthMetricAPI.update.mockResolvedValueOnce({
      data: {
        id: 1,
        metricType: 'Updated Metric',
        value: 185,
        timestamp: '2024-09-24T12:00'
      }
    });

    render(<HealthMetric />);

    // Click the edit button for the first metric
    fireEvent.click(screen.getByText(/edit/i));

    // Change the form fields
    fireEvent.change(screen.getByLabelText(/Metric Type/i), {
      target: { value: 'Updated Metric' }
    });
    fireEvent.change(screen.getByLabelText(/Value/i), {
      target: { value: '185' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Update Metric/i));

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(HealthMetricAPI.update).toHaveBeenCalledWith(1, {
        metricType: 'Updated Metric',
        value: 185,
        timestamp: expect.any(String),
        user: { id: localStorage.getItem('userId') }
      });
    });

    // Verify that the updated metric is shown in the table
    expect(await screen.findByText('Updated Metric')).toBeInTheDocument();
    expect(screen.getByText('185')).toBeInTheDocument();
  });

  test('handles deleting a health metric', async () => {
    HealthMetricAPI.delete.mockResolvedValueOnce();

    render(<HealthMetric />);

    // Click the delete button for the first metric
    fireEvent.click(screen.getByText(/delete/i));

    // Verify that the API was called
    await waitFor(() => {
      expect(HealthMetricAPI.delete).toHaveBeenCalledWith(1);
    });

    // Ensure the metric is no longer in the table
    expect(screen.queryByText('Weight')).not.toBeInTheDocument();
  });
});
