import React, { useState, useEffect } from 'react';
import { Calendar, Paperclip, File as FileIcon, Download, X } from "lucide-react";
import TareaService from '../../services/tarea.service';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const DetallesTareas = ({
  isOpen,
  onClose,
  task,
  comentarios,
  nuevoComentario,
  setNuevoComentario,
  handleAddComentario,
  commentsContainerRef,
  selectedFile,
  setSelectedFile,
}) => {
  const [commentFiles, setCommentFiles] = useState([]);

  // ** Preview de Archivos **
  const [hoverPreview, setHoverPreview] = useState(null);
  const HoverPreview = ({ file }) => {
    if (!file) return null;

    const { url, tipo, nombre } = file;
    const originalName = nombre.split("_").slice(1).join("_");

    return (
      <div
        className="absolute top-0 right-[-330px] w-[300px] bg-white dark:bg-gray-900
                 shadow-xl rounded-lg p-3 z-[999] border border-gray-200
                 dark:border-gray-700"
      >
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 truncate">
          {originalName}
        </div>

        {/* Imagen */}
        {tipo?.startsWith("image") && (
          <img src={url} className="w-full rounded-md max-h-[250px] object-cover" />
        )}

        {/* PDF */}
        {tipo === "application/pdf" && (
          <iframe src={url} className="w-full h-[250px] rounded-md" />
        )}

        {/* TXT */}
        {tipo === "text/plain" && (
          <iframe src={url} className="w-full h-[250px] rounded-md bg-white" />
        )}

        {/* Word */}
        {(tipo === "application/msword" ||
          tipo ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                url
              )}`}
              className="w-full h-[250px] rounded-md"
            />
          )}
      </div>
    );
  };


  useEffect(() => {
    if (isOpen && task && comentarios) {
      const filesFromComments = comentarios
        .filter(c => c.archivoNombre)
        .map(c => ({ nombre: c.archivoNombre }));
      setCommentFiles(filesFromComments);
    }
  }, [isOpen, task, comentarios]);



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("El archivo es demasiado grande. El tamaño máximo es de 500MB.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDownload = async (filename) => {
    try {
      const response = await TareaService.downloadFile(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.split('_').slice(1).join('_')); // Download with original name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const isImage = (file) => {
    // We get the content type from the backend now
    return file.tipo && file.tipo.startsWith('image');
  }

  if (!isOpen || !task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-light-surface dark:bg-dark-surface rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-sm z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {task.titulo}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-w-2xl">
              {task.descripcion || 'Sin descripción'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Columna Izquierda: Detalles y Archivos */}
            <div className="lg:col-span-1 space-y-6">
              {/* Detalles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
                  Detalles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="text-light-primary dark:text-dark-primary mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Fecha límite</span>
                      <span>{task.fechaEntrega || 'No especificada'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className={`w-4 h-4 mt-0.5 rounded-full ${task.prioridad === 'alta' ? 'bg-red-500' : task.prioridad === 'media' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Prioridad</span>
                      <span className="capitalize">{task.prioridad}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Responsables</span>
                    <div className="flex flex-wrap gap-2">
                      {(task.responsables || []).map((r) => (
                        <span
                          key={r.id}
                          title={r.username}
                          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium"
                        >
                          {r.username}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Archivos de la Tarea de referencia */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
                  Archivos de referencia
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {task.archivos && task.archivos.length > 0 ? (
                    task.archivos.map((a) => (
                      <div key={a.id} className="text-sm flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {isImage(a) ? (
                            <img src={a.url} alt={a.nombre} className="w-8 h-8 rounded-md object-cover" />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center rounded-md bg-light-primary/10 dark:bg-dark-primary/10">
                              <FileIcon size={16} className="text-light-primary dark:text-dark-primary" />
                            </div>
                          )}
                          <span className="text-gray-700 dark:text-gray-300 truncate" title={a.nombre.split('_').slice(1).join('_')}>
                            {a.nombre.split('_').slice(1).join('_')}
                          </span>
                        </div>
                        <button onClick={() => handleDownload(a.nombre)} className="text-light-primary dark:text-dark-primary p-1 rounded-full hover:bg-light-primary/10 dark:hover:bg-dark-primary/10">
                          <Download size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">Sin archivos adjuntos</p>
                  )}
                </div>
              </div>

              {/* Archivos de los comentarios de la tarea */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
                  Archivos de Comentarios
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {commentFiles.length > 0 ? (
                    commentFiles.map((file, index) => (
                      <div key={index} className="text-sm flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-light-primary/10 dark:bg-dark-primary/10">
                            <FileIcon size={16} className="text-light-primary dark:text-dark-primary" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 truncate" title={file.nombre.split('_').slice(1).join('_')}>
                            {file.nombre.split('_').slice(1).join('_')}
                          </span>
                        </div>
                        <button onClick={() => handleDownload(file.nombre)} className="text-light-primary dark:text-dark-primary p-1 rounded-full hover:bg-light-primary/10 dark:hover:bg-dark-primary/10">
                          <Download size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">Sin archivos en comentarios</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Comentarios */}
            <div className="lg:col-span-2 space-y-4 flex flex-col relative">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
                Actividad
              </h3>
              <div ref={commentsContainerRef} className="flex-1 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 border border-light-divider dark:border-dark-divider">
                {comentarios.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">Aún no hay comentarios.</p>
                ) : (
                  <ul className="space-y-5">
                    {comentarios.map((c) => (
                      <li key={c.id} className="text-sm">
                        <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                          {c.autor?.username || 'Usuario'}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-surface p-3 rounded-lg shadow-sm">
                          <p className="whitespace-pre-wrap">{c.contenido}</p>
                          {c.archivoNombre && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                              <Paperclip size={14} className="text-light-primary dark:text-dark-primary" />
                              <span
                                onMouseEnter={() =>
                                  setHoverPreview({
                                    nombre: c.archivoNombre,
                                    tipo: c.archivoTipo, // asegúrate que lo envíes desde backend
                                    url: `${import.meta.env.VITE_BACKEND_URL}/tareas/file/${c.archivoNombre}`,
                                  })
                                }
                                onMouseLeave={() => setHoverPreview(null)}
                                className="text-xs text-light-primary dark:text-dark-primary hover:underline cursor-pointer"
                              >
                                {c.archivoNombre.split("_").slice(1).join("_")}
                              </span>

                              <button
                                onClick={() => handleDownload(c.archivoNombre)}
                                className="ml-2 text-light-primary dark:text-dark-primary p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                              >
                                <Download size={14} />
                              </button>

                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <form onSubmit={handleAddComentario} className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                  />
                  <label className="flex items-center justify-center w-10 h-10 border border-light-divider dark:border-dark-divider rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Paperclip size={16} className="text-gray-600 dark:text-gray-400" />
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                  <button
                    type="submit"
                    disabled={!nuevoComentario.trim() && !selectedFile}
                    className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg text-sm font-medium transition-all hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
                {selectedFile && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Paperclip size={12} />
                    <span>Archivo listo para adjuntar: {selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className='text-red-500 hover:underline text-xs'>
                      (Quitar)
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Preview de Archivos */}
            {hoverPreview && <HoverPreview file={hoverPreview} />}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesTareas;