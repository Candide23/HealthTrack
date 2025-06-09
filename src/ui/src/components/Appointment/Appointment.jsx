import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppointmentAPI } from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [conflictDetails, setConflictDetails] = useState('');

  const navigate = useNavigate();

  // Memoize user to prevent re-parsing on every render
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);

  const userId = user?.id;

  // Predefined options for better UX
  const doctorOptions = [
    'Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Davis', 'Dr. Miller',
    'Dr. Wilson', 'Dr. Moore', 'Dr. Taylor', 'Dr. Anderson', 'Dr. Thomas'
  ];

  const locationOptions = [
    'Main Medical Center', 'Downtown Clinic', 'North Side Hospital',
    'South Medical Plaza', 'West End Health Center', 'East Bay Clinic',
    'University Medical Center', 'Community Health Center'
  ];

  const reasonOptions = [
    'Annual Check-up', 'Follow-up Visit', 'Blood Test', 'Vaccination',
    'Physical Therapy', 'Consultation', 'X-Ray/Imaging', 'Specialist Referral',
    'Emergency Visit', 'Routine Screening', 'Blood Pressure Check',
    'Diabetes Management', 'Cardiology Consultation', 'Dermatology',
    'Mental Health', 'Other'
  ];

  // Memoize fetchAppointments to prevent recreation on every render
  const fetchAppointments = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await AppointmentAPI.getAll(userId);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    if (userId) {
      fetchAppointments();
    }
  }, [user, userId, navigate, fetchAppointments]);

  useEffect(() => {
    // Check for conflicts when appointment date changes
    if (appointmentDate && appointments.length > 0) {
      checkForConflicts();
    } else {
      setShowConflictWarning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentDate, appointments.length]);

  const checkForConflicts = () => {
    if (!appointmentDate || appointments.length === 0) return;

    const newAppointmentTime = dayjs(appointmentDate);
    const conflicts = appointments.filter(apt => {
      if (editingId && apt.id === editingId) return false; // Skip current appointment when editing

      const existingTime = dayjs(apt.appointmentDate || apt.appointmentTime);
      const timeDiff = Math.abs(newAppointmentTime.diff(existingTime, 'hours', true));

      return timeDiff < 2; // Within 2 hours
    });

    if (conflicts.length > 0) {
      const conflictList = conflicts.map(apt =>
        `Dr. ${apt.doctorName} at ${dayjs(apt.appointmentDate || apt.appointmentTime).format('MMM DD, h:mm A')}`
      ).join(', ');

      setConflictDetails(`Potential conflict with: ${conflictList}`);
      setShowConflictWarning(true);
    } else {
      setShowConflictWarning(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!doctorName.trim() || !location.trim() || !appointmentDate || !reasonForVisit.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Show conflict confirmation if needed
    if (showConflictWarning && !editingId) {
      if (!window.confirm(`⚠️ ${conflictDetails}. Do you want to continue?`)) {
        return;
      }
    }

    const appointmentData = {
      doctorName: doctorName.trim(),
      location: location.trim(),
      appointmentDate,
      reasonForVisit: reasonForVisit.trim(),
      userId,
    };

    try {
      if (editingId) {
        await AppointmentAPI.update(editingId, appointmentData);
        showSuccessMessage('📅 Appointment updated successfully!');
      } else {
        await AppointmentAPI.create(appointmentData);
        showSuccessMessage('✅ Appointment scheduled successfully!');
      }

      fetchAppointments();
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error.response?.data || error.message);
      alert('❌ Error saving appointment. Please try again.');
    }
  };

  const showSuccessMessage = (message) => {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        border: 1px solid #c3e6cb;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      ">
        ${message}
      </div>
    `;

    document.body.appendChild(successDiv);
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 3000);
  };

  const resetForm = () => {
    setDoctorName('');
    setLocation('');
    setAppointmentDate('');
    setReasonForVisit('');
    setEditingId(null);
    setShowForm(false);
    setShowConflictWarning(false);
  };

  const handleEdit = (appointment) => {
    setDoctorName(appointment.doctorName);
    setLocation(appointment.location);
    setAppointmentDate(dayjs(appointment.appointmentDate || appointment.appointmentTime).format('YYYY-MM-DDTHH:mm'));
    setReasonForVisit(appointment.reasonForVisit);
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const handleDelete = async (id, appointmentDetails) => {
    if (!window.confirm(`Are you sure you want to cancel the appointment with ${appointmentDetails}?`)) {
      return;
    }

    try {
      await AppointmentAPI.delete(id);
      fetchAppointments();
      showSuccessMessage('🗑️ Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('❌ Error cancelling appointment. Please try again.');
    }
  };

  const getAppointmentStatus = (appointmentDate) => {
    const now = dayjs();
    const apptTime = dayjs(appointmentDate);

    if (apptTime.isBefore(now)) {
      return { status: 'past', label: 'Completed', class: 'badge-secondary' };
    } else if (apptTime.diff(now, 'hours') <= 24) {
      return { status: 'soon', label: 'Tomorrow', class: 'badge-warning' };
    } else if (apptTime.diff(now, 'hours') <= 2) {
      return { status: 'urgent', label: 'Soon', class: 'badge-danger' };
    } else {
      return { status: 'upcoming', label: 'Upcoming', class: 'badge-success' };
    }
  };

  const getTimeUntil = (appointmentDate) => {
    const now = dayjs();
    const apptTime = dayjs(appointmentDate);

    if (apptTime.isBefore(now)) {
      return apptTime.fromNow();
    } else {
      return `in ${apptTime.fromNow().replace('in ', '')}`;
    }
  };

  const getFilteredAppointments = () => {
    const now = dayjs();

    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => dayjs(apt.appointmentDate || apt.appointmentTime).isAfter(now));
      case 'past':
        return appointments.filter(apt => dayjs(apt.appointmentDate || apt.appointmentTime).isBefore(now));
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments().sort((a, b) => {
    const dateA = dayjs(a.appointmentDate || a.appointmentTime);
    const dateB = dayjs(b.appointmentDate || b.appointmentTime);
    return filter === 'past' ? dateB.diff(dateA) : dateA.diff(dateB);
  });

  const upcomingCount = appointments.filter(apt =>
    dayjs(apt.appointmentDate || apt.appointmentTime).isAfter(dayjs())
  ).length;

  const pastCount = appointments.filter(apt =>
    dayjs(apt.appointmentDate || apt.appointmentTime).isBefore(dayjs())
  ).length;

  const getMinDateTime = () => {
    return dayjs().format('YYYY-MM-DDTHH:mm');
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Quick Stats */}
      {appointments.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-light border-primary text-center">
              <div className="card-body">
                <h5 className="text-primary">📅 Total</h5>
                <h3 className="text-primary">{appointments.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light border-success text-center">
              <div className="card-body">
                <h5 className="text-success">⏰ Upcoming</h5>
                <h3 className="text-success">{upcomingCount}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light border-secondary text-center">
              <div className="card-body">
                <h5 className="text-secondary">✅ Completed</h5>
                <h3 className="text-secondary">{pastCount}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              📋 {editingId ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h5>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={resetForm}
            >
              ✕
            </button>
          </div>
          <div className="card-body">
            {showConflictWarning && (
              <div className="alert alert-warning">
                ⚠️ <strong>Scheduling Conflict:</strong> {conflictDetails}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>👨‍⚕️ Doctor Name</label>
                    <input
                      list="doctors"
                      type="text"
                      className="form-control"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Enter or select doctor name"
                      required
                    />
                    <datalist id="doctors">
                      {doctorOptions.map((doctor, index) => (
                        <option key={index} value={doctor} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>🏥 Location</label>
                    <input
                      list="locations"
                      type="text"
                      className="form-control"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter or select location"
                      required
                    />
                    <datalist id="locations">
                      {locationOptions.map((loc, index) => (
                        <option key={index} value={loc} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>📅 Appointment Date & Time</label>
                    <input
                      type="datetime-local"
                      className={`form-control ${showConflictWarning ? 'border-warning' : ''}`}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={getMinDateTime()}
                      required
                    />
                    <small className="text-muted">
                      Please select a future date and time
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>🩺 Reason for Visit</label>
                    <input
                      list="reasons"
                      type="text"
                      className="form-control"
                      value={reasonForVisit}
                      onChange={(e) => setReasonForVisit(e.target.value)}
                      placeholder="Enter or select reason"
                      required
                    />
                    <datalist id="reasons">
                      {reasonOptions.map((reason, index) => (
                        <option key={index} value={reason} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className={`btn btn-sm ${showConflictWarning ? 'btn-warning' : 'btn-success'}`}
                >
                  📅 {editingId ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group btn-group-sm" role="group">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button
            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('past')}
          >
            Past ({pastCount})
          </button>
        </div>

        {!showForm && (
          <button
            className="btn btn-success btn-sm"
            onClick={() => setShowForm(true)}
          >
            ➕ New Appointment
          </button>
        )}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="row">
          {filteredAppointments.map((appointment) => {
            const status = getAppointmentStatus(appointment.appointmentDate || appointment.appointmentTime);
            const timeInfo = getTimeUntil(appointment.appointmentDate || appointment.appointmentTime);

            return (
              <div key={appointment.id} className="col-md-6 col-lg-4 mb-3">
                <div className={`card h-100 ${status.status === 'urgent' ? 'border-danger' : status.status === 'soon' ? 'border-warning' : ''}`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>👨‍⚕️ {appointment.doctorName}</strong>
                    <span className={`badge ${status.class}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <small className="text-muted">📍 Location:</small>
                      <br />
                      <strong>{appointment.location}</strong>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">📅 Date & Time:</small>
                      <br />
                      <strong>{dayjs(appointment.appointmentDate || appointment.appointmentTime).format('MMM DD, YYYY')}</strong>
                      <br />
                      <strong>{dayjs(appointment.appointmentDate || appointment.appointmentTime).format('h:mm A')}</strong>
                      <br />
                      <small className={`${status.status === 'past' ? 'text-muted' : 'text-primary'}`}>
                        {timeInfo}
                      </small>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">🩺 Reason:</small>
                      <br />
                      <span className="text-wrap">{appointment.reasonForVisit}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="btn-group w-100">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(appointment)}
                        title="Edit appointment"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(appointment.id, `Dr. ${appointment.doctorName}`)}
                        title="Cancel appointment"
                      >
                        🗑️ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            {filter === 'all' && '📅 No appointments scheduled'}
            {filter === 'upcoming' && '⏰ No upcoming appointments'}
            {filter === 'past' && '📋 No past appointments'}
          </div>
          <p className="text-muted">
            {filter === 'upcoming' && upcomingCount === 0 && 'Schedule your next appointment to stay on top of your health!'}
            {filter === 'past' && pastCount === 0 && 'Your appointment history will appear here.'}
            {filter === 'all' && appointments.length === 0 && 'Schedule your first appointment to get started!'}
          </p>
          {!showForm && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(true)}
            >
              📅 Schedule Your First Appointment
            </button>
          )}
        </div>
      )}

      {/* Helpful Tips */}
      {appointments.length > 0 && (
        <div className="mt-4 p-3 bg-light rounded">
          <h6>💡 Appointment Tips:</h6>
          <ul className="mb-0 small">
            <li>Arrive 15 minutes early for check-in and paperwork</li>
            <li>Bring a valid ID and insurance information</li>
            <li>Prepare a list of current medications and symptoms</li>
            <li>Set reminders on your phone for important appointments</li>
            <li>Keep this list updated to avoid scheduling conflicts</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Appointment;




