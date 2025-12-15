import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PatientView } from './components/PatientView';
import { ClinicianView } from './components/ClinicianView';
import { LabDetailView } from './components/LabDetailView';
import { LandingPage } from './components/LandingPage';
import { Role } from './types';

type Route = 'landing' | 'patient-dashboard' | 'patient-lab' | 'clinician-dashboard';

const App = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [role, setRole] = useState<Role>(null);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setCurrentRoute(selectedRole === 'patient' ? 'patient-dashboard' : 'clinician-dashboard');
  };

  const switchRole = () => {
    const newRole = role === 'patient' ? 'clinician' : 'patient';
    setRole(newRole);
    setCurrentRoute(newRole === 'patient' ? 'patient-dashboard' : 'clinician-dashboard');
  };

  // Render Logic
  if (currentRoute === 'landing') {
    return <LandingPage onSelectRole={handleRoleSelect} />;
  }

  // App Layout
  return (
    <Layout role={role} onSwitchRole={switchRole}>
      {currentRoute === 'patient-dashboard' && (
        <PatientView onNavigate={setCurrentRoute} />
      )}
      {currentRoute === 'patient-lab' && (
        <LabDetailView onBack={() => setCurrentRoute('patient-dashboard')} />
      )}
      {currentRoute === 'clinician-dashboard' && (
        <ClinicianView />
      )}
    </Layout>
  );
};

export default App;