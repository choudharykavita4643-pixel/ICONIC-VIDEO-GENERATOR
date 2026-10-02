import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  Film,
  FileText,
  Image as ImageIcon,
  Music,
  Mic,
  Search,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';
import { Project, ProjectCategory, ScreenTab } from '../../types';
import { storageService, heroImg, cyberpunkImg, jungleRobotImg } from '../../services/storageService';

interface ProjectsViewProps {
  onOpenProject: (tab: ScreenTab, project: Project) => void;
  onNewProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenProject, onNewProject }) => {
  const [projects, setProjects] = useState<Project[]>(storageService.getProjects());
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete project
  const handleDelete = (id: string) => {
    if (confirm('Delete this project from your library?')) {
      storageService.deleteProject(id);
      setProjects(storageService.getProjects());
    }
  };

  // Start rename
  const handleStartRename = (project: Project) => {
    setEditingProjectId(project.id);
    setNewTitle(project.title);
  };

  // Save rename
  const handleSaveRename = (project: Project) => {
    if (newTitle.trim()) {
      storageService.saveProject({
        ...project,
        title: newTitle.trim(),
      });
      setProjects(storageService.getProjects());
    }
    setEditingProjectId(null);
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedFilter === 'all' || p.category === selectedFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: ProjectCategory) => {
    switch (cat) {
      case 'video':
        return <Film className="w-4 h-4 text-cyan-400" />;
      case 'script':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-pink-400" />;
      case 'lyrics':
        return <Music className="w-4 h-4 text-purple-400" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getCategoryTab = (cat: ProjectCategory): ScreenTab => {
    switch (cat) {
      case 'video':
        return 'video-maker';
      case 'script':
        return 'script-generator';
      case 'image':
        return 'photo-generator';
      case 'lyrics':
        return 'lyric-generator';
      case 'audio':
        return 'audio-generator';
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Project Library</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your video compositions, scripts, generated artwork, and audio assets.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'video', label: 'Videos' },
            { id: 'script', label: 'Scripts' },
            { id: 'image', label: 'AI Photos' },
            { id: 'lyrics', label: 'Lyrics' },
            { id: 'audio', label: 'Audio TTS' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedFilter === item.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full sm:w-60 bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#090D16] border border-slate-800 text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first video, generate an image or script, and it will be stored securely here.
          </p>
          <button
            onClick={onNewProject}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-[#090D16] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition shadow-lg flex flex-col justify-between"
            >
              {/* Thumbnail / Header */}
              <div
                onClick={() => onOpenProject(getCategoryTab(project.category), project)}
                className="relative aspect-video bg-black/60 cursor-pointer overflow-hidden"
              >
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    {getCategoryIcon(project.category)}
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[11px] text-white font-medium capitalize">
                  {getCategoryIcon(project.category)}
                  <span>{project.category}</span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-4 space-y-2">
                {editingProjectId === project.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 bg-slate-900 border border-cyan-500 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(project)}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3
                    onClick={() => onOpenProject(getCategoryTab(project.category), project)}
                    className="text-sm font-bold text-slate-100 line-clamp-1 cursor-pointer hover:text-cyan-400 transition"
                  >
                    {project.title}
                  </h3>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="capitalize">{project.category} Project</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenProject(getCategoryTab(project.category), project)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartRename(project)}
                    className="p-1.5 text-slate-400 hover:text-white transition"
                    title="Rename Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
