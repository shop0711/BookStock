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
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-[#C9A96E] bg-[#F5F0E8] scale-[1.01]'
            : imagePreview
              ? 'border-[#E8E4DF] bg-[#FDFBF7]'
              : 'border-[#D4CFC6] hover:border-[#C9A96E] hover:bg-[#F5F0E8] cursor-pointer'
        }`}
      >
        {!imagePreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-4xl">
              <Camera size={32} className="text-[#C9A96E]/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#4A5568]">
                画像をドラッグ＆ドロップ
              </p>
              <p className="text-xs text-[#8A8A8A] mt-1">
                または クリックして選択
              </p>
            </div>
          </motion.div>
        ) : (
          <img
            src={imagePreview}
            alt="アップロードされた画像"
            className="max-h-32 object-contain rounded-lg mx-auto"
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
          <div className="bg-[#E8E4DF] rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#C9A96E] to-[#B8960B] h-full rounded-full"
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
          <p className="text-xs text-[#C9A96E] font-medium font-serif">認識されたテキスト</p>
          <textarea
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            className="w-full min-h-[60px] max-h-[120px] p-3 rounded-xl border border-[#E8E4DF] bg-[#F5F0E8]/50 text-sm text-[#2D3748] resize-y focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] transition-all duration-200"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-[#C9A96E] to-[#B8960B] text-[#1B2438] font-semibold px-6 py-2.5 rounded-xl text-sm hover:from-[#D4B876] hover:to-[#C9A96E] transition-all duration-200"
          >
            この内容で検索
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-[#8A8A8A] hover:text-[#4A5568] text-sm py-2 transition-colors duration-200"
          >
            <RotateCcw size={14} />
            リセット
          </button>
        </motion.div>
      )}
    </div>
  );
}
