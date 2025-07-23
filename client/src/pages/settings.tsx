export default function Settings() {
  // Router component that directs to appropriate settings page based on user type
  const userType = localStorage.getItem('userType');
  
  if (userType === 'victim') {
    window.location.href = '/victim-settings';
    return null;
  } else if (userType === 'admin') {
    window.location.href = '/admin-settings';
    return null;
  } else {
    window.location.href = '/officer-settings';
    return null;
  }
}