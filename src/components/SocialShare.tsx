import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  summary?: string;
}

export function SocialShare({ url, title, summary }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform: 'facebook' | 'linkedin' | 'x') => {
    window.open(shareLinks[platform], '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
      <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center text-gray-500 text-sm whitespace-nowrap">
        <Share2 className="h-4 w-4 mr-1" />
        Partager :
      </span>
        <div className="flex items-center gap-1">
          <button
              onClick={() => handleShare('facebook')}
              className="p-2 text-[#1877F2] hover:bg-blue-50 rounded-full transition-colors duration-200"
              title="Partager sur Facebook"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
              onClick={() => handleShare('x')}
              className="p-2 text-black hover:bg-gray-50 rounded-full transition-colors duration-200"
              title="Partager sur X"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          <button
              onClick={() => handleShare('linkedin')}
              className="p-2 text-[#0A66C2] hover:bg-blue-50 rounded-full transition-colors duration-200"
              title="Partager sur LinkedIn"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          <div className="relative">
            <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Copier le lien"
            >
              <Link2 className="h-4 w-4" />
            </button>
            {copied && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2">
                  <div className="flex items-center space-x-1 text-green-600 text-sm bg-white px-2 py-1 rounded-md shadow-sm whitespace-nowrap">
                    <Check className="h-3 w-3" />
                    <span>Copié</span>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}