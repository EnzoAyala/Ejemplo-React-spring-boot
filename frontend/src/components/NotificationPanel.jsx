import React from 'react';
import { Bell, X, Check, XCircle } from 'lucide-react';
import NotificacionService from '../services/notificacion.service';
import ProyectoService from '../services/proyecto.service';

const NotificationPanel = ({ notifications, onClose, onNotificationRead }) => {

  const handleMarkAsRead = (notificationId) => {
    NotificacionService.markAsRead(notificationId)
      .then(() => {
        onNotificationRead(notificationId);
      })
      .catch(err => console.error("Error al marcar la notificación como leída:", err));
  };

  const handleInvitationResponse = (proyectoId, response, notificationId) => {
    ProyectoService.responderInvitacion(proyectoId, response)
      .then(() => {
        handleMarkAsRead(notificationId);
      })
      .catch(err => console.error("Error al responder a la invitación:", err));
  };

  return (
    <div className="fixed top-[60px] inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40" onClick={onClose}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm 
               bg-light-surface dark:bg-dark-surface 
               shadow-2xl z-50 transform transition-transform duration-500 ease-in-out 
               animate-left-to-right rounded-l-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-light-divider dark:border-dark-divider">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text tracking-tight">
            Notificaciones
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
          >
            <X size={22} className="text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-light-text-secondary dark:text-dark-text-secondary animate-fade-in">
              <Bell size={48} className="mb-4 text-light-accent dark:text-dark-accent animate-pulse" />
              <p className="text-sm">No tienes notificaciones nuevas.</p>
            </div>
          ) : (
            <ul className="divide-y divide-light-divider dark:divide-dark-divider">
              {notifications.map(notif => (
                <li
                  key={notif.idNotificacion}
                  className={`p-4 transition-colors duration-300 rounded-md ${!notif.leida
                    ? 'bg-light-elevated dark:bg-dark-elevated animate-scale-in'
                    : 'hover:bg-light-hover dark:hover:bg-dark-hover'
                    }`}
                >
                  <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                    {notif.mensaje}
                  </p>
                  <div className="flex justify-end mt-3 space-x-3">
                    {notif.tipo === 'invitacion_proyecto' && !notif.leida && (
                      <>
                        <button
                          onClick={() => handleInvitationResponse(notif.proyecto.id, 'aceptado', notif.idNotificacion)}
                          className="text-xs font-medium text-light-success hover:underline flex items-center transition-transform hover:scale-105"
                        >
                          <Check size={14} className="mr-1" /> Aceptar
                        </button>
                        <button
                          onClick={() => handleInvitationResponse(notif.proyecto.id, 'rechazado', notif.idNotificacion)}
                          className="text-xs font-medium text-light-danger hover:underline flex items-center transition-transform hover:scale-105"
                        >
                          <XCircle size={14} className="mr-1" /> Rechazar
                        </button>
                      </>
                    )}
                    {!notif.leida && notif.tipo !== 'invitacion_proyecto' && (
                      <button
                        onClick={() => handleMarkAsRead(notif.idNotificacion)}
                        className="text-xs font-medium text-light-primary dark:text-dark-primary hover:underline transition-transform hover:scale-105"
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

  );
};

export default NotificationPanel;
