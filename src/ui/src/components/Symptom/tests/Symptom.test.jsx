import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Symptom from '../Symptom.jsx';
import { SymptomAPI } from '../../../services/api';

// Mock API calls
jest.mock('../../../services/api', () => ({
  SymptomAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Symptom Component', () => {
  beforeEach(() => {
    SymptomAPI.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          symptomType: 'Headache',
          severity: 3,
          description: 'Mild headache with occasional pain near the temples',
          timestamp: '2024-09-23T10:30'
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders symptom form and table correctly', async () => {
    render(<Symptom />);

    // Check that the form inputs are rendered
    expect(screen.getByLabelText(/Symptom Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Severity \(1-10\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();

    // Check that the table headers are rendered
    expect(await screen.findByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Verify the symptom data in the table
    expect(await screen.findByText(/Headache/)).toBeInTheDocument();
    expect(screen.getByText('Mild headache with occasional pain near the temples')).toBeInTheDocument();
  });

  test('handles form submission correctly for adding a new symptom', async () => {
    SymptomAPI.create.mockResolvedValueOnce({
      data: {
        id: 2,
        symptomType: 'Fatigue',
        severity: 5,
        description: 'Feeling tired and low energy',
        timestamp: '2024-09-23T11:00'
      }
    });

    render(<Symptom />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Symptom Type/i), {
      target: { value: 'Fatigue' }
    });
    fireEvent.change(screen.getByLabelText(/Severity \(1-10\)/i), {
      target: { value: '5' }
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Feeling tired and low energy' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add Symptom/i));

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(SymptomAPI.create).toHaveBeenCalledWith({
        symptomType: 'Fatigue',
        severity: 5,
        description: 'Feeling tired and low energy',
        timestamp: expect.any(String),
        userId: localStorage.getItem('userId')
      });
    });

    // Verify that the newly added symptom is shown in the table
    expect(await screen.findByText('Fatigue')).toBeInTheDocument();
    expect(screen.getByText('Feeling tired and low energy')).toBeInTheDocument();
  });

  test('handles editing a symptom', async () => {
    SymptomAPI.update.mockResolvedValueOnce({
      data: {
        id: 1,
        symptomType: 'Updated Symptom',
        severity: 4,
        description: 'Updated description',
        timestamp: '2024-09-24T12:00'
      }
    });

    render(<Symptom />);

    // Click the edit button for the first symptom
    fireEvent.click(screen.getByText(/edit/i));

    // Change the form fields
    fireEvent.change(screen.getByLabelText(/Symptom Type/i), {
      target: { value: 'Updated Symptom' }
    });
    fireEvent.change(screen.getByLabelText(/Severity \(1-10\)/i), {
      target: { value: '4' }
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Updated description' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Update Symptom/i));

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(SymptomAPI.update).toHaveBeenCalledWith(1, {
        symptomType: 'Updated Symptom',
        severity: 4,
        description: 'Updated description',
        timestamp: expect.any(String),
        userId: localStorage.getItem('userId')
      });
    });

    // Verify that the updated symptom is shown in the table
    expect(await screen.findByText('Updated Symptom')).toBeInTheDocument();
    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });

  test('handles deleting a symptom', async () => {
    SymptomAPI.delete.mockResolvedValueOnce();

    render(<Symptom />);

    // Click the delete button for the first symptom
    fireEvent.click(screen.getByText(/delete/i));

    // Verify that the API was called
    await waitFor(() => {
      expect(SymptomAPI.delete).toHaveBeenCalledWith(1);
    });

    // Ensure the symptom is no longer in the table
    expect(screen.queryByText('Headache')).not.toBeInTheDocument();
  });
});
