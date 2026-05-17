import { useState, useEffect, type FC } from 'react';

const InstallBanner: FC = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShow(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: show manual instructions
      alert('请使用浏览器菜单中的"添加到主屏幕"或"安装应用"功能');
    }
  };

  if (!show || dismissed) return null;

  return (
    <div
      className="mx-4 mt-3 p-3 rounded-xl flex items-center justify-between gap-3 animate-pulse"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))', border: '1px solid rgba(0,212,255,0.3)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">📲</span>
        <div>
          <div className="text-sm font-medium" style={{ color: '#00d4ff' }}>安装到桌面</div>
          <div className="text-xs text-gray-400">像普通App一样使用</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="text-xs px-2 py-1 rounded-lg text-gray-500"
        >
          忽略
        </button>
        <button
          onClick={handleInstall}
          className="text-xs px-3 py-1.5 rounded-lg font-medium"
          style={{ background: '#00d4ff', color: '#000' }}
        >
          安装
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
