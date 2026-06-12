import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConceptModal({ isOpen, onClose }: ConceptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#1B2438]/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="bg-[#FDFBF7]/90 backdrop-blur-xl rounded-[28px] shadow-[0_12px_50px_rgba(27,36,56,0.15)] border border-[#C9A96E]/10 max-w-md w-full relative p-8 select-none font-serif text-[#2D3748]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-[#C9A96E]/10 active:scale-95 transition-all duration-200 text-[#4A5568]/60 hover:text-[#1B2438]"
            >
              <X size={16} />
            </button>

            {/* Concept Title */}
            <div className="text-center mt-4 mb-8">
              <h2 className="text-sm font-medium tracking-[0.25em] text-[#C9A96E] uppercase">
                BookStock Archive
              </h2>
              <p className="text-[10px] text-[#4A5568]/50 mt-1 tracking-widest italic">
                哲学と触感の調和
              </p>
            </div>

            {/* Stories */}
            <div className="space-y-8 text-left leading-relaxed">
              {/* Concept 1 */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-medium text-[#1B2438] tracking-widest border-b border-[#C9A96E]/15 pb-2">
                  心地よい操作感
                </h3>
                <p className="text-[11px] text-[#4A5568]/80 font-light tracking-wide leading-loose">
                  横スクロールで棚を眺めながら、気になる背表紙に触れるとスッと小気味よく上に浮き上がり、タップすればお馴染みの美しい詳細モーダルへと繋がる。この滑らかなマイクロインタラクションは、用もないのに何度もアプリを開きたくしてしまいます。
                </p>
              </div>

              {/* Concept 2 */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-medium text-[#1B2438] tracking-widest border-b border-[#C9A96E]/15 pb-2">
                  「読了」の演出
                </h3>
                <p className="text-[11px] text-[#4A5568]/80 font-light tracking-wide leading-loose">
                  読み終えた本の背表紙が、彩度を落としたセピア調になって棚の奥に静かに馴染んでいることで、自分の「読書の足跡」がアンティークな風合いで蓄積されていく満足感もあります。
                </p>
              </div>
            </div>

            {/* Footer decoration */}
            <div className="mt-10 text-center text-[9px] text-[#C9A96E]/40 tracking-[0.3em] uppercase">
              — Premium Library —
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
