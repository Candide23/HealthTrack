import React, { useState, useEffect } from 'react';
import { getAppointments, addAppointment } from '../../services/api';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data } = await getAppointments();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAppointment(doctorName, location, appointmentDate, reasonForVisit, 1);  // Replace 1 with actual userId
    setDoctorName('');
    setLocation('');
    setAppointmentDate('');
    setReasonForVisit('');
    const { data } = await getAppointments();
    setAppointments(data);
  };

  return (
    <div className="container mt-5">
      <h2>Schedule Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Doctor's Name</label>
          <input type="text" className="form-control" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date & Time</label>
          <input type="datetime-local" className="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Reason for Visit</label>
          <textarea className="form-control" value={reasonForVisit} onChange={(e) => setReasonForVisit(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Schedule Appointment</button>
      </form>

      <h2 className="mt-5">Upcoming Appointments</h2>
      <ul className="list-group mt-3">
        {appointments.map(appointment => (
          <li key={appointment.id} className="list-group-item">
            {appointment.doctorName} at {appointment.location} on {new Date(appointment.appointmentDate).toLocaleString()} - {appointment.reasonForVisit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointment;
