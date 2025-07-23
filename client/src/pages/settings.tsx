import { Redirect } from "wouter";

export default function Settings() {
  // Router component that directs to appropriate settings page based on user type
  const userType = localStorage.getItem('userType');
  
  console.log('Settings router - userType:', userType); // Debug log
  
  if (userType === 'victim') {
    return <Redirect to="/victim-settings" />;
  } else if (userType === 'admin') {
    return <Redirect to="/admin-settings" />;
  } else {
    return <Redirect to="/officer-settings" />;
  }
}