import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { PatientView } from './components/PatientView';
import { ClinicianView } from './components/ClinicianView';
import { LabDetailView } from './components/LabDetailView';
import { LandingPage } from './components/LandingPage';
import { Role } from './types';

type Route = 'landing' | 'patient-dashboard' | 'patient-lab' | 'clinician-dashboard';

const App = () => {
  const baseUrl = (import.meta as any)?.env?.BASE_URL ?? '/';
  const baseNoTrail = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [role, setRole] = useState<Role>(null);
  const [pathname, setPathname] = useState<string>(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  const toInternalPath = (fullPathname: string) => {
    if (!baseNoTrail || baseNoTrail === '/') return fullPathname || '/';
    if (fullPathname === baseNoTrail) return '/';
    if (fullPathname.startsWith(baseNoTrail + '/')) {
      const rest = fullPathname.slice(baseNoTrail.length);
      return rest || '/';
    }
    return fullPathname || '/';
  };

  const toFullPath = (internalPath: string) => {
    if (!baseNoTrail || baseNoTrail === '/') return internalPath;
    if (internalPath === '/' || internalPath === '') return baseNoTrail + '/';
    return baseNoTrail + internalPath;
  };

  const syncFromPath = (fullPathname: string) => {
    setPathname(fullPathname);
    const path = toInternalPath(fullPathname);
    if (path === '/' || path === '/whitepaper') {
      setCurrentRoute('landing');
      setRole(null);
      return;
    }
    if (path === '/patient' || path === '/patient/') {
      setRole('patient');
      setCurrentRoute('patient-dashboard');
      return;
    }
    if (path === '/patient/lab' || path === '/patient/lab/') {
      setRole('patient');
      setCurrentRoute('patient-lab');
      return;
    }
    if (path === '/profession' || path === '/profession/' || path === '/clinician' || path === '/clinician/') {
      setRole('clinician');
      setCurrentRoute('clinician-dashboard');
      return;
    }
    // Fallback: unknown path -> landing
    setCurrentRoute('landing');
    setRole(null);
  };

  const navigate = (toInternal: string) => {
    if (typeof window === 'undefined') return;
    const full = toFullPath(toInternal);
    window.history.pushState({}, '', full);
    syncFromPath(full);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    syncFromPath(window.location.pathname);
    const onPopState = () => syncFromPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleSelect = (selectedRole: Role) => {
    if (!selectedRole) return;
    try {
      window.localStorage.setItem('biolens:lastRole', selectedRole);
    } catch {
      // ignore
    }
    navigate(selectedRole === 'patient' ? '/patient' : '/profession');
  };

  const switchRole = () => {
    const newRole = role === 'patient' ? 'clinician' : 'patient';
    try {
      window.localStorage.setItem('biolens:lastRole', newRole);
    } catch {
      // ignore
    }
    navigate(newRole === 'patient' ? '/patient' : '/profession');
  };

  const landingTab = useMemo<'home' | 'whitepaper'>(() => {
    const internal = toInternalPath(pathname);
    return internal === '/whitepaper' ? 'whitepaper' : 'home';
  }, [pathname]);

  // Render Logic
  if (currentRoute === 'landing') {
    return (
      <LandingPage
        activeTab={landingTab}
        onNavigate={navigate}
        onSelectRole={handleRoleSelect}
      />
    );
  }

  // App Layout
  return (
    <Layout role={role} onGoHome={() => navigate('/')} onSwitchRole={switchRole}>
      {currentRoute === 'patient-dashboard' && (
        <PatientView onNavigate={(p) => navigate(p === 'patient-lab' ? '/patient/lab' : '/patient')} />
      )}
      {currentRoute === 'patient-lab' && (
        <LabDetailView onBack={() => navigate('/patient')} />
      )}
      {currentRoute === 'clinician-dashboard' && (
        <ClinicianView />
      )}
    </Layout>
  );
};

export default App;
