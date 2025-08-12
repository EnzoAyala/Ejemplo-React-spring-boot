import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './index.css';

import AppRoutes from './routes/AppRoutes';
import AuthService from './services/auth.service';
import UserService from './services/user.service';
import useTheme from './hooks/useTheme';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [theme, setTheme] = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.roles.includes('ROLE_ADMIN'));
      setIsUser(user.roles.includes('ROLE_USER'));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setIsAdmin(false);
    setIsUser(false);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleToggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleCloseMobileMenu = () => setMobileMenuOpen(false);

  const handleOpenProfileModal = () => setProfileModalOpen(true);
  const handleCloseProfileModal = () => setProfileModalOpen(false);

  const handleSaveProfile = async (formData) => {
    try {
      const userId = currentUser.id;
      await UserService.updateUserProfile(userId, formData);
      handleCloseProfileModal();
      // Opcional: Forzar la recarga de los datos del usuario
      const updatedUser = AuthService.getCurrentUser();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const getNavLinkClasses = ({ isActive }) =>
    `transition-colors duration-300 font-medium ${isActive
      ? 'text-light-primary dark:text-dark-primary'
      : 'text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary'
    }`;

  return (
    <Router>
      <div className="w-full min-h-screen font-sans bg-light-surface dark:bg-dark-surface transition-colors duration-300">
        <Header
          currentUser={currentUser}
          isAdmin={isAdmin}
          isUser={isUser}
          theme={theme}
          toggleTheme={toggleTheme}
          logOut={logOut}
          mobileMenuOpen={mobileMenuOpen}
          handleToggleMobileMenu={handleToggleMobileMenu}
          handleCloseMobileMenu={handleCloseMobileMenu}
          getNavLinkClasses={getNavLinkClasses}
          onOpenProfileModal={handleOpenProfileModal}
        />
        <main className="w-full max-w-full mx-auto py-6 mt-16 transition-colors duration-300">
          <AppRoutes />
        </main>

        {isProfileModalOpen && (
          <ProfileModal
            user={currentUser}
            onClose={handleCloseProfileModal}
            onSave={handleSaveProfile}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
