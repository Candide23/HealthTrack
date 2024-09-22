import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HealthMetric from './components/HealthMetric/HealthMetric';
import Symptom from './components/Symptom/Symptom';
import Appointment from './components/Appointment/Appointment';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="container mt-5">
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/health-metrics" component={HealthMetric} />
          <Route path="/symptoms" component={Symptom} />
          <Route path="/appointments" component={Appointment} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

