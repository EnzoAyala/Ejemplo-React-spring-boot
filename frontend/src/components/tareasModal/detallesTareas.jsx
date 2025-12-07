import React from 'react';
import { Calendar } from "lucide-react";

const DetallesTareas = ({
  isOpen,
  onClose,
  task,
  comentarios,
  nuevoComentario,
  setNuevoComentario,
  handleAddComentario,
  commentsContainerRef
}) => {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl bg-light-surface dark:bg-dark-surface rounded-xl shadow-xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                <span>{task.titulo}</span>
              </h2>
              <span className="text-light-primary dark:text-dark-primary text-sm">📝</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {task.descripcion || 'Sin descripción'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cerrar
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DETALLES */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Detalles de la tarea
            </h3>
            <div className="space-y-3">
              {/* Fecha */}
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} className="text-light-primary dark:text-dark-primary" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Fecha límite:</span>
                {task.fechaEntrega || '—'}
              </div>
              {/* Prioridad */}
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-5 h-5 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">P</span>
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">Prioridad:</span>
                {task.prioridad}
              </div>
              {/* Responsables */}
              <div className="flex flex-col space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Responsables:</span>
                <div className="flex flex-wrap gap-2">
                  {(task.responsables || []).map((r) => (
                    <span
                      key={r.id}
                      className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium shadow-sm"
                    >
                      {r.username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COMENTARIOS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Comentarios</h3>
            <div ref={commentsContainerRef} className="max-h-56 overflow-y-auto rounded-lg p-4 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider shadow-md">
              {comentarios.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500">Sin comentarios</p>
              ) : (
                <ul className="space-y-3">
                  {comentarios.map((c) => (
                    <li key={c.id} className="text-sm">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {c.autor?.username || 'Usuario'}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">{c.contenido}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* INPUT + BOTÓN */}
            <form onSubmit={handleAddComentario} className="flex gap-4">
              <input
                type="text"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Agregar un comentario..."
                className="flex-1 border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg text-sm transition-all hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesTareas;
