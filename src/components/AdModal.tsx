import React, { useEffect, useState } from 'react';
import { adBanners } from '../data/adBanners';

interface AdModalProps {
  onClose: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ onClose }) => {
  const [currentAd, setCurrentAd] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % adBanners.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full text-center relative">
        <p className="text-sm text-gray-500 mb-2">
          {canClose ? 'Reklamı kapatabilirsiniz' : `Reklam bitmesine kalan süre: ${secondsLeft} saniye`}
        </p>

        <a href={adBanners[currentAd].linkUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={adBanners[currentAd].imageUrl}
            alt="Reklam"
            className="w-full h-auto max-h-[250px] object-contain rounded-md mb-2"
          />
        </a>

        <button
          onClick={onClose}
          disabled={!canClose}
          className={`w-full py-2 mt-2 rounded-md font-semibold text-white transition duration-200 ${canClose ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Reklamı Kapat
        </button>
      </div>
    </div>
  );
};

export default AdModal;