import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './index.css';

import AppRoutes from './routes/AppRoutes';
import AuthService from './services/auth.service';
import useTheme from './hooks/useTheme';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import Chat from './components/Sidebar/Chat';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [theme, setTheme] = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isChatClosing, setChatClosing] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.roles?.includes('ROLE_ADMIN'));
      setIsUser(user.roles?.includes('ROLE_USER'));
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

  const handleOpenChat = () => {
    setChatClosing(false);
    setChatOpen(true);
  };
  const handleCloseChat = () => {
    setChatClosing(true);
    setTimeout(() => {
      setChatOpen(false);
      setChatClosing(false);
    }, 1000); // Corresponde a la duración de la animación
  };

  const handleSaveProfile = async (formData) => {
    try {
      const userId = currentUser.id;
      // updateUserProfile asume interceptor con Authorization
      // y maneja JSON o FormData transparente
      const { default: UserService } = await import('./services/user.service');
      await UserService.updateUserProfile(userId, formData);
      handleCloseProfileModal();
      const updatedUser = AuthService.getCurrentUser();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
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
          {currentUser && ( // Solo se ve si estas logueado
            <button type="button" onClick={handleOpenChat} aria-label="Abrir chat">
              {/* Botón para abrir el chat a la derecha */}
              <div className="fixed bottom-4 right-4 z-30 bg-green-500 p-3 rounded-full text-white hover:bg-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
              </div>
            </button>
          )}
        </main>
      </div>

      {/* Modal de perfil */}
      {isProfileModalOpen && (
        <ProfileModal
          user={currentUser}
          onClose={handleCloseProfileModal}
          onSave={handleSaveProfile}
        />
      )}

      {/* Chat - panel lateral derecho */}
      {isChatOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
            onClick={handleCloseChat}
          />
          <aside className={`fixed inset-y-0 right-0 z-50 w-full max-w-screen-md bg-light-surface dark:bg-dark-surface shadow-xl flex flex-col ${isChatClosing ? 'animate-right-to-left' : 'animate-left-to-right'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Chat</h2>
              <button
                type="button"
                onClick={handleCloseChat}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Cerrar chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </aside>
        </>
      )}
    </Router>
  );
}

export default App;
