import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, CheckCircle, MessageSquare, Send } from 'lucide-react';

interface FeedbackWidgetProps {
  messageId: string;
  query: string;
  responseSnippet: string;
  onFeedbackSubmit: (feedback: {
    messageId: string;
    query: string;
    responseSnippet: string;
    isHelpful: boolean;
    rating: number;
    accuracyTag: string;
    comment: string;
  }) => Promise<void>;
}

const ACCURACY_TAGS = [
  'Accurate info',
  'Clear steps',
  'Friendly & engaging',
  'Missing details',
  'Outdated info',
  'Needs clarification'
];

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  messageId,
  query,
  responseSnippet,
  onFeedbackSubmit
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [selectedTag, setSelectedTag] = useState<string>('Accurate info');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickVote = async (helpful: boolean) => {
    setIsHelpful(helpful);
    setRating(helpful ? 5 : 2);
    setSelectedTag(helpful ? 'Accurate info' : 'Needs clarification');
    setIsOpen(true);
  };

  const handleDetailedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isHelpful === null) return;

    setIsSubmitting(true);
    try {
      await onFeedbackSubmit({
        messageId,
        query,
        responseSnippet: responseSnippet.substring(0, 200),
        isHelpful,
        rating,
        accuracyTag: selectedTag,
        comment: comment.trim()
      });
      setSubmitted(true);
      setIsOpen(false);
    } catch (err) {
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 mt-2">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span>Thank you! Your feedback evolves UNIZULU Advisor accuracy 🌟</span>
      </div>
    );
  }

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-100">
      {!isOpen ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Rate this answer:</span>
          <button
            id={`btn-feedback-thumb-up-${messageId}`}
            onClick={() => handleQuickVote(true)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 transition-colors"
            title="Helpful and accurate"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Helpful</span>
          </button>
          <button
            id={`btn-feedback-thumb-down-${messageId}`}
            onClick={() => handleQuickVote(false)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 transition-colors"
            title="Needs improvement or inaccurate"
          >
            <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
            <span>Not helpful</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleDetailedSubmit} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Rate response accuracy for: &ldquo;{query.slice(0, 45)}...&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              &times;
            </button>
          </div>

          {/* Star rating selection */}
          <div className="flex items-center gap-1">
            <span className="text-slate-600 mr-2">Accuracy:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setIsHelpful(star >= 3);
                }}
                className="p-0.5 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 font-medium text-slate-700">
              {rating === 5 ? 'Exceptional' : rating === 4 ? 'Good & accurate' : rating === 3 ? 'Average' : 'Needs work'}
            </span>
          </div>

          {/* Tag Selection */}
          <div className="flex flex-wrap gap-1.5">
            {ACCURACY_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded-full border text-[11px] font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-[#002B49] text-white border-[#002B49]'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Optional Comment */}
          <div className="relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional: How could this response be more accurate or helpful?"
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#002B49]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#002B49] hover:bg-[#003B66] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isSubmitting ? 'Saving...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
