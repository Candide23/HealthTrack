import React, { useState, useEffect } from 'react';
import { getSymptoms, addSymptom } from '../../services/api';

const Symptom = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomType, setSymptomType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const fetchSymptoms = async () => {
      const { data } = await getSymptoms();
      setSymptoms(data);
    };
    fetchSymptoms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSymptom(symptomType, severity, description, timestamp, 1);  // Replace 1 with the actual userId
    setSymptomType('');
    setSeverity('');
    setDescription('');
    setTimestamp('');
    const { data } = await getSymptoms();
    setSymptoms(data);
  };

  return (
    <div className="container mt-5">
      <h2>Log Symptom</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Symptom Type</label>
          <input type="text" className="form-control" value={symptomType} onChange={(e) => setSymptomType(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Severity</label>
          <input type="number" className="form-control" value={severity} onChange={(e) => setSeverity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Timestamp</label>
          <input type="datetime-local" className="form-control" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Log Symptom</button>
      </form>

      <h2 className="mt-5">Symptoms</h2>
      <ul className="list-group mt-3">
        {symptoms.map(symptom => (
          <li key={symptom.id} className="list-group-item">
            {symptom.symptomType} - Severity {symptom.severity} at {new Date(symptom.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Symptom;
