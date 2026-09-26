import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  Clock,
  Users,
  Globe2,
  CheckCircle2,
  ListTodo,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Calendar,
} from 'lucide-react';
import { DecisionItem, TaskItem, QuestionItem, Participant, LanguageInfo } from '../../types';

interface SessionSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNewSession: () => void;
  durationFormatted: string;
  participants: Participant[];
  languages: LanguageInfo[];
  decisions: DecisionItem[];
  tasks: TaskItem[];
  questions: QuestionItem[];
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  isOpen,
  onClose,
  onStartNewSession,
  durationFormatted,
  participants,
  languages,
  decisions,
  tasks,
  questions,
}) => {
  const [isPlayingSummary, setIsPlayingSummary] = useState(false);

  const confirmedTasks = tasks.filter((t) => t.status === 'confirmed').length;
  const resolvedQuestions = questions.filter((q) => q.isResolved).length;

  const handlePlaySummary = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingSummary) {
        window.speechSynthesis.cancel();
        setIsPlayingSummary(false);
      } else {
        const text = `Session complete. Total conversation time was ${durationFormatted}. The team reached ${decisions.length} decisions, including shifting the production release to Monday. ${tasks.length} action items were created, and ${languages.length} languages were spoken seamlessly.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.onend = () => setIsPlayingSummary(false);
        utterance.onerror = () => setIsPlayingSummary(false);
        setIsPlayingSummary(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlayingSummary(!isPlayingSummary);
    }
  };

  const handleExportMarkdown = () => {
    const md = `# AuraLife Executive Session Summary
**Duration:** ${durationFormatted}
**Date:** ${new Date().toLocaleDateString()}
**Participants:** ${participants.map((p) => p.name).join(', ')}
**Languages:** ${languages.map((l) => `${l.name} (${l.percentage}%)`).join(', ')}

---

## 🎯 Key Decisions Logged (${decisions.length})
${decisions.map((d, i) => `${i + 1}. **${d.title}**\n   - Decided by: ${d.sourceSpeaker} at ${d.timestamp}\n   - Context: ${d.context || 'N/A'}`).join('\n\n')}

---

## 📋 Action Items & Commitments (${tasks.length})
${tasks.map((t, i) => `${i + 1}. [${t.status === 'confirmed' ? 'x' : ' '}] **${t.title}**\n   - Assignee: ${t.owner}\n   - Deadline: ${t.deadline} (Status: ${t.status})`).join('\n\n')}

---

## ❓ Questions & Inquiries (${questions.length})
${questions.map((q, i) => `${i + 1}. **${q.text}**\n   - Asked by: ${q.askedBy} (${q.isResolved ? 'RESOLVED' : 'OPEN'})\n   ${q.resolvedAnswer ? `- Resolution: ${q.resolvedAnswer}` : ''}`).join('\n\n')}

*Generated automatically by AuraLife Voice Intelligence Workspace.*
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auralife-session-summary-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Executive Summary"
      subtitle={`Session concluded • Duration: ${durationFormatted}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#26292F] bg-[#1C1F24] p-3 text-center">
            <div className="flex items-center justify-center text-[#5B7FFF] mb-1">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold font-mono text-[#EDEFF2] block">
              {durationFormatted}
            </span>
            <span className="text-[11px] text-[#A3AAB5]">Total Duration</span>
          </div>

          <div className="rounded-xl border border-[#26292F] bg-[#1C1F24] p-3 text-center">
            <div className="flex items-center justify-center text-[#3ECF8E] mb-1">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-[#EDEFF2] block">
              {decisions.length}
            </span>
            <span className="text-[11px] text-[#A3AAB5]">Decisions Reached</span>
          </div>

          <div className="rounded-xl border border-[#26292F] bg-[#1C1F24] p-3 text-center">
            <div className="flex items-center justify-center text-[#5B7FFF] mb-1">
              <ListTodo className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-[#EDEFF2] block">
              {tasks.length}
            </span>
            <span className="text-[11px] text-[#A3AAB5]">
              Tasks ({confirmedTasks} Confirmed)
            </span>
          </div>

          <div className="rounded-xl border border-[#26292F] bg-[#1C1F24] p-3 text-center">
            <div className="flex items-center justify-center text-[#E3A54A] mb-1">
              <Globe2 className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-[#EDEFF2] block">
              {languages.length}
            </span>
            <span className="text-[11px] text-[#A3AAB5]">Languages Spoken</span>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#EDEFF2] flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#5B7FFF]" />
            <span>Chronological Event Timeline</span>
          </h4>

          <div className="rounded-xl border border-[#26292F] bg-[#1C1F24]/50 p-4 space-y-3 max-h-56 overflow-y-auto">
            <div className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[#5F6773] shrink-0">10:41:04</span>
              <span className="h-2 w-2 mt-1.5 rounded-full bg-[#5B7FFF] shrink-0" />
              <div>
                <span className="font-semibold text-[#EDEFF2]">Session Initialized:</span> Rahul started the sprint cutover review.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[#5F6773] shrink-0">10:41:18</span>
              <span className="h-2 w-2 mt-1.5 rounded-full bg-[#E3A54A] shrink-0" />
              <div>
                <span className="font-semibold text-[#E3A54A]">Cross-Language Switch:</span> Aman raised shard latency issue in Hindi; live translated.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[#5F6773] shrink-0">10:41:26</span>
              <span className="h-2 w-2 mt-1.5 rounded-full bg-[#3ECF8E] shrink-0" />
              <div>
                <span className="font-semibold text-[#3ECF8E]">Decision Captured:</span> Shift release window to Monday 10:00 AM.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[#5F6773] shrink-0">10:41:33</span>
              <span className="h-2 w-2 mt-1.5 rounded-full bg-[#5B7FFF] shrink-0" />
              <div>
                <span className="font-semibold text-[#5B7FFF]">Task Delegated:</span> Aman assigned shard benchmark report for Sunday 6 PM.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[#5F6773] shrink-0">10:41:51</span>
              <span className="h-2 w-2 mt-1.5 rounded-full bg-[#EF4B52] shrink-0" />
              <div>
                <span className="font-semibold text-[#EF4B52]">AI Interrupted:</span> Rahul seized floor to exclude EU routing from Monday cutover.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#26292F] pt-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePlaySummary}
              icon={<Play className="h-3.5 w-3.5" />}
            >
              {isPlayingSummary ? 'Pause AI Summary' : 'Play AI Summary'}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleExportMarkdown}
              icon={<Download className="h-3.5 w-3.5" />}
            >
              Export Markdown
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={onStartNewSession}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Start New Session
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
