import React, { useState } from 'react';
import { QuestionItem } from '../../types';
import { HelpCircle, CheckCircle2, User, Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface QuestionCardProps {
  question: QuestionItem;
  onResolve?: (id: string, answer?: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onResolve,
}) => {
  const { id, text, askedBy, timestamp, isResolved, resolvedAnswer } = question;
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const handleConfirmResolve = () => {
    onResolve?.(id, answerText.trim() || undefined);
    setShowAnswerInput(false);
  };

  return (
    <div
      className={`group rounded-xl border p-3.5 transition-all ${
        isResolved
          ? 'border-[#26292F] bg-[#141619]/60'
          : 'border-[#E3A54A]/30 bg-[#1C1F24]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`shrink-0 rounded-lg p-1 ${
            isResolved
              ? 'bg-[#3ECF8E]/10 text-[#3ECF8E]'
              : 'bg-[#E3A54A]/10 text-[#E3A54A]'
          }`}
        >
          {isResolved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <HelpCircle className="h-4 w-4" />
          )}
        </span>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold leading-snug ${
              isResolved ? 'text-[#A3AAB5] line-through' : 'text-[#EDEFF2]'
            }`}
          >
            {text}
          </p>

          {/* Resolution note if present */}
          {resolvedAnswer && (
            <p className="mt-2 text-xs text-[#3ECF8E] bg-[#3ECF8E]/10 rounded-lg p-2 border border-[#3ECF8E]/20">
              Resolved: {resolvedAnswer}
            </p>
          )}

          {/* Meta line */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-[#5F6773]">
            <span className="flex items-center gap-1.5 text-[#A3AAB5]">
              <User className="h-3 w-3" />
              <span>Asked by {askedBy}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="h-3 w-3" />
              {timestamp}
            </span>
          </div>

          {/* Inline answer input if triggered */}
          {showAnswerInput && (
            <div className="mt-3 space-y-2 pt-2 border-t border-[#26292F]">
              <input
                type="text"
                placeholder="Resolution note or decision..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full rounded-lg border border-[#5B7FFF] bg-[#141619] px-2.5 py-1.5 text-xs text-[#EDEFF2] placeholder-[#5F6773] focus:outline-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="success" onClick={handleConfirmResolve}>
                  Confirm Resolution
                </Button>
                <button
                  onClick={() => setShowAnswerInput(false)}
                  className="text-xs text-[#A3AAB5] hover:text-[#EDEFF2] px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action to resolve */}
          {!isResolved && !showAnswerInput && (
            <div className="mt-3 flex justify-end border-t border-[#26292F] pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAnswerInput(true)}
                icon={<CheckCircle2 className="h-3 w-3 text-[#3ECF8E]" />}
              >
                Mark Resolved
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
