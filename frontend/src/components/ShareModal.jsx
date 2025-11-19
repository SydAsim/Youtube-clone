import React from 'react';
import { X, Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, videoUrl, title }) => {
  if (!isOpen) return null;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(videoUrl)}`
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(videoUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800 shadow-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-bold mb-6">Share</h3>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white">{link.name}</span>
            </a>
          ))}
        </div>

        <div className="bg-black/50 rounded-lg p-2 flex items-center gap-2 border border-gray-800">
          <input 
            type="text" 
            readOnly 
            value={videoUrl} 
            className="bg-transparent flex-1 text-sm text-gray-300 outline-none px-2"
          />
          <button 
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
