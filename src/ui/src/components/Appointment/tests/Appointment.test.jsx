import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Appointment from '../Appointment.jsx';
import { AppointmentAPI } from '../../../services/api'; // Mock the API

// Mocking the API calls for fetching, creating, updating, and deleting
jest.mock('../../../services/api', () => ({
  AppointmentAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Appointment Component', () => {
  beforeEach(() => {
    // Set up default behavior for the mocked API calls
    AppointmentAPI.getAll.mockResolvedValue({
      data: [
        {
          id: 1,
          doctorName: 'Dr. Smith',
          location: 'City Clinic',
          appointmentTime: '2024-09-23T12:30',
          reasonForVisit: 'Routine Checkup'
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders appointment form and table correctly', async () => {
    render(<Appointment />);

    // Check that the form inputs are rendered
    expect(screen.getByLabelText(/Doctor Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Appointment Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason for Visit/i)).toBeInTheDocument();

    // Check that the table headers are rendered
    expect(await screen.findByText('Doctor')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Appointment Time')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Verify the appointment data in the table
    expect(await screen.findByText(/Dr\. Smith/)).toBeInTheDocument();
    expect(screen.getByText('City Clinic')).toBeInTheDocument();
    expect(screen.getByText('Routine Checkup')).toBeInTheDocument();
  });

  test('handles form submission correctly for adding a new appointment', async () => {
    // Set up create API to resolve successfully
    AppointmentAPI.create.mockResolvedValueOnce({
      data: {
        id: 2,
        doctorName: 'Dr. John',
        location: 'Health Clinic',
        appointmentTime: '2024-10-01T09:00',
        reasonForVisit: 'Consultation'
      }
    });

    render(<Appointment />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Doctor Name/i), {
      target: { value: 'Dr. John' }
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: 'Health Clinic' }
    });
    fireEvent.change(screen.getByLabelText(/Appointment Time/i), {
      target: { value: '2024-10-01T09:00' }
    });
    fireEvent.change(screen.getByLabelText(/Reason for Visit/i), {
      target: { value: 'Consultation' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add Appointment/i));

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(AppointmentAPI.create).toHaveBeenCalledWith({
        doctorName: 'Dr. John',
        location: 'Health Clinic',
        appointmentDate: '2024-10-01T09:00',
        reasonForVisit: 'Consultation',
        userId: localStorage.getItem('userId')
      });
    });

    // Verify that the newly added appointment is shown in the table
    expect(await screen.findByText('Dr. John')).toBeInTheDocument();
    expect(screen.getByText('Health Clinic')).toBeInTheDocument();
    expect(screen.getByText('Consultation')).toBeInTheDocument();
  });

  test('handles editing an appointment', async () => {
    // Set up update API to resolve successfully
    AppointmentAPI.update.mockResolvedValueOnce({
      data: {
        id: 1,
        doctorName: 'Dr. Updated',
        location: 'Updated Clinic',
        appointmentTime: '2024-09-25T10:00',
        reasonForVisit: 'Updated Checkup'
      }
    });

    render(<Appointment />);

    // Click the edit button for the first appointment
    fireEvent.click(screen.getByText(/edit/i));

    // Change the form fields
    fireEvent.change(screen.getByLabelText(/Doctor Name/i), {
      target: { value: 'Dr. Updated' }
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: 'Updated Clinic' }
    });
    fireEvent.change(screen.getByLabelText(/Appointment Time/i), {
      target: { value: '2024-09-25T10:00' }
    });
    fireEvent.change(screen.getByLabelText(/Reason for Visit/i), {
      target: { value: 'Updated Checkup' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Update Appointment/i));

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(AppointmentAPI.update).toHaveBeenCalledWith(1, {
        doctorName: 'Dr. Updated',
        location: 'Updated Clinic',
        appointmentDate: '2024-09-25T10:00',
        reasonForVisit: 'Updated Checkup',
        userId: localStorage.getItem('userId')
      });
    });

    // Verify that the updated appointment is shown in the table
    expect(await screen.findByText('Dr. Updated')).toBeInTheDocument();
    expect(screen.getByText('Updated Clinic')).toBeInTheDocument();
    expect(screen.getByText('Updated Checkup')).toBeInTheDocument();
  });

  test('handles deleting an appointment', async () => {
    // Set up delete API to resolve successfully
    AppointmentAPI.delete.mockResolvedValueOnce();

    render(<Appointment />);

    // Click the delete button for the first appointment
    fireEvent.click(screen.getByText(/delete/i));

    // Verify that the API was called
    await waitFor(() => {
      expect(AppointmentAPI.delete).toHaveBeenCalledWith(1);
    });

    // Ensure the appointment is no longer in the table
    expect(screen.queryByText('Dr. Smith')).not.toBeInTheDocument();
  });
});
