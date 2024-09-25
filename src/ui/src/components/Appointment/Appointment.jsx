import React, { useState, useEffect } from 'react';
import { AppointmentAPI } from '../../services/api';
import dayjs from 'dayjs';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [editingId, setEditingId] = useState(null);

  const userId = localStorage.getItem('userId');  // Fetch the logged-in user ID

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await AppointmentAPI.getAll(userId);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const appointmentData = {
      doctorName,
      location,
      appointmentDate,
      reasonForVisit,
      userId
    };

    try {
      if (editingId) {
        await AppointmentAPI.update(editingId, appointmentData);
      } else {
        await AppointmentAPI.create(appointmentData);
      }
      fetchAppointments();
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error.response ? error.response.data : error.message);
    }
  };

  const resetForm = () => {
    setDoctorName('');
    setLocation('');
    setAppointmentDate('');
    setReasonForVisit('');
    setEditingId(null);
  };

  return (
    <div>
      <form onSubmit={handleSave} className="mb-4">
        <div className="form-group">
          <label>Doctor Name</label>
          <input
            type="text"
            className="form-control"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Appointment Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Reason for Visit</label>
          <input
            type="text"
            className="form-control"
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success btn-sm">
          {editingId ? 'Update Appointment' : 'Add Appointment'}
        </button>
      </form>

      {/* Adjusted table for a smaller and more compact design */}
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Doctor</th>
              <th style={{ width: '20%' }}>Location</th>
              <th style={{ width: '20%' }}>Appointment Time</th>
              <th style={{ width: '30%' }}>Reason</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.doctorName}</td>
                <td>{appointment.location}</td>
                <td>{dayjs(appointment.appointmentTime).format('YYYY-MM-DD HH:mm')}</td>
                <td>{appointment.reasonForVisit}</td>
                <td>
                  {/* Flexbox to make buttons more compact */}
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setDoctorName(appointment.doctorName);
                        setLocation(appointment.location);
                        setAppointmentDate(dayjs(appointment.appointmentTime).format('YYYY-MM-DDTHH:mm'));
                        setReasonForVisit(appointment.reasonForVisit);
                        setEditingId(appointment.id);
                      }}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => AppointmentAPI.delete(appointment.id).then(fetchAppointments)}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointment;



