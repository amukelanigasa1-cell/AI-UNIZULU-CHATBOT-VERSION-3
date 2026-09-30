import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FastForward } from 'lucide-react';

interface TypewriterMarkdownProps {
  content: string;
  isLatest: boolean;
  onAnimationComplete?: () => void;
}

export const TypewriterMarkdown: React.FC<TypewriterMarkdownProps> = ({
  content,
  isLatest,
  onAnimationComplete
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(() => {
    return isLatest ? 0 : content.length;
  });
  const [isTyping, setIsTyping] = useState<boolean>(() => {
    return Boolean(isLatest && content.length > 0);
  });
  
  const hasAnimatedRef = useRef<boolean>(!isLatest);
  const currentLengthRef = useRef<number>(isLatest ? 0 : content.length);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If not the latest message or already finished animating, display full text immediately
    if (!isLatest || hasAnimatedRef.current) {
      setDisplayedLength(content.length);
      setIsTyping(false);
      return;
    }

    const totalLength = content.length;
    if (totalLength === 0) {
      setDisplayedLength(0);
      setIsTyping(false);
      hasAnimatedRef.current = true;
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 0);
      }
      return;
    }

    currentLengthRef.current = 0;
    setDisplayedLength(0);
    setIsTyping(true);

    const chunkSize = Math.max(3, Math.ceil(totalLength / 80));
    const intervalMs = 18;

    timerRef.current = setInterval(() => {
      currentLengthRef.current += chunkSize;
      if (currentLengthRef.current >= totalLength) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        hasAnimatedRef.current = true;
        setDisplayedLength(totalLength);
        setIsTyping(false);
        if (onAnimationComplete) {
          setTimeout(onAnimationComplete, 0);
        }
      } else {
        setDisplayedLength(currentLengthRef.current);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [content, isLatest, onAnimationComplete]);

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    hasAnimatedRef.current = true;
    currentLengthRef.current = content.length;
    setDisplayedLength(content.length);
    setIsTyping(false);
    if (onAnimationComplete) {
      setTimeout(onAnimationComplete, 0);
    }
  };

  const visibleText = content.slice(0, displayedLength);

  return (
    <div className="relative group/typewriter">
      {/* Student-friendly, softer typography - avoiding harsh heavy bold text */}
      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed prose-headings:text-[#002138] prose-headings:font-semibold prose-headings:tracking-normal prose-a:text-sky-600 hover:prose-a:text-sky-700 prose-a:font-medium prose-strong:text-slate-900 prose-strong:font-semibold prose-li:marker:text-sky-400">
        <ReactMarkdown>{visibleText}</ReactMarkdown>
        {isTyping && (
          <span 
            className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-pulse rounded-xs align-middle shadow-[0_0_8px_rgba(56,189,248,0.9)]"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Subtle Skip Button while typing */}
      {isTyping && (
        <div className="mt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full transition-all shadow-2xs cursor-pointer"
            title="Show full text immediately"
          >
            <FastForward className="w-3 h-3 text-sky-500" />
            <span>Skip animation</span>
          </button>
        </div>
      )}
    </div>
  );
};
