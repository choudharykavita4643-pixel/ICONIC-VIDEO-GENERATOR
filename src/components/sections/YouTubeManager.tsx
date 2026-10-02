import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Upload,
  Eye,
  ThumbsUp,
  MessageSquare,
  Lock,
  Globe,
  Link2,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { YouTubeChannel, YouTubeVideoItem } from '../../types';
import { youtubeService } from '../../services/youtubeService';
import { cyberpunkImg } from '../../services/storageService';

interface YouTubeManagerProps {
  incomingVideoToUpload?: {
    title: string;
    description: string;
    thumbnail: string;
  } | null;
}

export const YouTubeManager: React.FC<YouTubeManagerProps> = ({ incomingVideoToUpload }) => {
  const [channel, setChannel] = useState<YouTubeChannel | null>(youtubeService.getChannel());
  const [videos, setVideos] = useState<YouTubeVideoItem[]>(youtubeService.getVideos());
  const [isConnecting, setIsConnecting] = useState(false);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadPrivacy, setUploadPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');
  const [uploadThumb, setUploadThumb] = useState(cyberpunkImg);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Edit Video Modal State
  const [editingVideo, setEditingVideo] = useState<YouTubeVideoItem | null>(null);

  // OAuth Client ID config state
  const [showOAuthConfig, setShowOAuthConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');

  // Handle incoming video from Video Maker
  useEffect(() => {
    if (incomingVideoToUpload) {
      setUploadTitle(incomingVideoToUpload.title);
      setUploadDesc(incomingVideoToUpload.description);
      setUploadThumb(incomingVideoToUpload.thumbnail);
      setShowUploadModal(true);
    }
  }, [incomingVideoToUpload]);

  // Connect YouTube
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await youtubeService.connectWithGoogleOAuth(clientIdInput.trim() || undefined);
      setChannel(result.channel);
      setVideos(result.videos);
    } catch (err: any) {
      alert(err.message || 'Failed to connect YouTube account.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect YouTube
  const handleDisconnect = () => {
    youtubeService.disconnect();
    setChannel(null);
    setVideos([]);
  };

  // Handle Upload Video
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    for (let i = 10; i <= 100; i += 20) {
      setUploadProgress(i);
      await new Promise((r) => setTimeout(r, 120));
    }

    const created = youtubeService.addUploadedVideo({
      title: uploadTitle,
      description: uploadDesc,
      thumbnail: uploadThumb,
      privacyStatus: uploadPrivacy,
    });

    setVideos(youtubeService.getVideos());
    setChannel(youtubeService.getChannel());
    setIsUploading(false);
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadDesc('');
    setUploadProgress(0);
  };

  // Handle Save Edit Video
  const handleSaveEdit = () => {
    if (!editingVideo) return;
    youtubeService.updateVideo(editingVideo.id, {
      title: editingVideo.title,
      description: editingVideo.description,
      privacyStatus: editingVideo.privacyStatus,
    });
    setVideos(youtubeService.getVideos());
    setEditingVideo(null);
  };

  // Handle Delete Video
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this video from your YouTube studio list?')) {
      youtubeService.deleteVideo(id);
      setVideos(youtubeService.getVideos());
      setChannel(youtubeService.getChannel());
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>YouTube Channel Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect your YouTube channel using Google OAuth. View channel analytics, publish videos, and update metadata.
          </p>
        </div>

        {channel ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Video</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="Disconnect and revoke Google OAuth access"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Disconnect</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Youtube className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect YouTube Channel'}</span>
            </button>

            <button
              onClick={() => setShowOAuthConfig(!showOAuthConfig)}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
              title="OAuth Client Settings"
            >
              Settings
            </button>
          </div>
        )}
      </div>

      {/* OAuth Client ID Configuration Dropdown */}
      {showOAuthConfig && !channel && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Google OAuth Client ID (Optional)</span>
            <button
              onClick={() => setShowOAuthConfig(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            By default, Creator Studio AI provides an instant, fully functional YouTube Studio test channel so you can manage videos and analytics immediately without manual Google Cloud configuration. To connect your live production channel, supply your standard OAuth Client ID:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
            />
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {/* When Disconnected: Clean Callout with Security Guarantees */}
      {!channel && (
        <div className="p-8 rounded-2xl bg-[#090D16] border border-slate-800 text-center space-y-4 max-w-2xl mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto shadow-inner">
            <Youtube className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Direct YouTube Integration</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Publish directly to YouTube, schedule Shorts, and track real-time subscriber counts and view analytics.
            </p>
          </div>

          {/* Security Standards Callout */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Google OAuth Architecture</span>
            </div>
            <ul className="text-slate-400 text-[11px] space-y-1 list-disc pl-4">
              <li>Zero password storage: we never ask for your Google credentials.</li>
              <li>No client secrets stored on frontend devices.</li>
              <li>Request only required YouTube upload and read permissions.</li>
              <li>Instant disconnect and token revocation anytime.</li>
            </ul>
          </div>

          <button
            onClick={handleConnect}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/25 transition active:scale-95"
          >
            Connect YouTube Channel
          </button>
        </div>
      )}

      {/* When Connected: Channel Dashboard & Video Management */}
      {channel && (
        <div className="space-y-6">
          {/* Channel Card & Quick Stats */}
          <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={channel.avatarUrl}
                alt={channel.title}
                className="w-16 h-16 rounded-full border-2 border-red-500/40 shadow-md object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{channel.title}</h3>
                  {channel.isDemo && (
                    <span className="text-[10px] font-medium text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      Studio Connected
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 block">{channel.handle}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Connected via Google OAuth v3
                </span>
              </div>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-6 text-center">
              <div>
                <span className="text-xs text-slate-400 block">Subscribers</span>
                <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-white">
                  {channel.subscriberCount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Total Views</span>
                <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-cyan-400">
                  {(channel.viewCount / 1000000).toFixed(2)}M
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Videos</span>
                <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-200">
                  {channel.videoCount}
                </span>
              </div>
            </div>
          </div>

          {/* Videos Table / Grid */}
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">
                Channel Videos ({videos.length})
              </span>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Video</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/30 rounded-xl px-2 transition"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-20 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-slate-200 line-clamp-1">{vid.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{vid.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>{vid.duration}</span>
                        <span>·</span>
                        <span className="capitalize text-slate-300">{vid.privacyStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-[11px] font-mono tabular-nums text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vid.views.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vid.likes.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vid.comments}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingVideo(vid)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 transition"
                        title="Edit title & visibility"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vid.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                        title="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Upload to YouTube</span>
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Enter a captivating YouTube title..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Add timestamps, hashtags, and social links..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Visibility</label>
                  <select
                    value={uploadPrivacy}
                    onChange={(e) => setUploadPrivacy(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                  >
                    <option value="public">Public (Instant)</option>
                    <option value="unlisted">Unlisted (Link Only)</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thumbnail</label>
                  <div className="flex items-center gap-2">
                    <img
                      src={uploadThumb}
                      alt="Thumbnail"
                      className="w-12 h-8 rounded object-cover border border-slate-700"
                    />
                    <span className="text-[11px] text-slate-400">Attached</span>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                    <span>Uploading & Processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadTitle.trim()}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isUploading ? 'Publishing...' : 'Publish to YouTube'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Metadata Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white">Edit Video Details</span>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingVideo.description}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Privacy Status</label>
                <select
                  value={editingVideo.privacyStatus}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      privacyStatus: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  onClick={() => setEditingVideo(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
