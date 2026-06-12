import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, RotateCcw } from 'lucide-react';

interface OcrUploaderProps {
  onSearchText: (text: string) => void;
}

export function OcrUploader({ onSearchText }: OcrUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start OCR
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setOcrText('');

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('jpn+eng', undefined, {
        logger: (m: { progress: number }) => {
          setProgress(Math.round(m.progress * 100));
        },
      });

      const { data } = await worker.recognize(file);
      setOcrText(data.text.trim());
      await worker.terminate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setOcrText('');
    setProgress(0);
    setError(null);
    setIsProcessing(false);
  };

  const handleSearch = () => {
    if (ocrText.trim()) {
      onSearchText(ocrText.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone / Preview */}
      <div
        onClick={() => !imagePreview && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-[#C9A96E] bg-[#C9A96E]/10 scale-[1.01]'
            : imagePreview
              ? 'border-[#C9A96E]/10 bg-[#C9A96E]/5'
              : 'border-[#C9A96E]/20 bg-[#C9A96E]/5 hover:bg-[#C9A96E]/10 cursor-pointer'
        }`}
      >
        {!imagePreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div>
              <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-[#C9A96E]/60" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#4A5568] tracking-wide">
                画像をドラッグ＆ドロップ
              </p>
              <p className="text-[10px] sm:text-xs text-[#4A5568]/50 mt-0.5">
                または タップして選択
              </p>
            </div>
          </motion.div>
        ) : (
          <img
            src={imagePreview}
            alt="アップロードされた画像"
            className="max-h-24 sm:max-h-32 object-contain rounded-lg mx-auto"
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Progress bar */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="bg-[#C9A96E]/10 rounded-full h-1 overflow-hidden">
            <motion.div
              className="bg-[#C9A96E] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-[#8A8A8A] text-center">
            テキストを認識中... {progress}%
          </p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* OCR Result */}
      {!isProcessing && ocrText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-[10px] text-[#C9A96E] font-serif tracking-widest uppercase mb-1">認識されたテキスト</p>
          <textarea
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            className="w-full min-h-[50px] sm:min-h-[60px] max-h-[100px] p-3 rounded-xl border border-transparent bg-[#C9A96E]/5 text-xs text-[#2D3748] focus:border-[#C9A96E]/30 focus:bg-transparent focus:ring-0 focus:outline-none transition-all duration-300 leading-relaxed"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-[#1B2438] text-[#FDFBF7] hover:bg-[#C9A96E] hover:text-[#1B2438] font-bold tracking-widest text-xs py-3.5 sm:py-2.5 rounded-xl transition-all duration-300 active:scale-[0.98]"
          >
            SEARCH
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-[#4A5568]/50 hover:text-[#2D3748] text-xs py-2 transition-all duration-300 active:scale-95"
          >
            <RotateCcw size={12} />
            RESET
          </button>
        </motion.div>
      )}
    </div>
  );
}
