import React, { useState } from 'react';
import { DecisionItem, TaskItem, QuestionItem } from '../../types';
import { DecisionCard } from './DecisionCard';
import { TaskCard } from './TaskCard';
import { QuestionCard } from './QuestionCard';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import {
  CheckCircle2,
  ListTodo,
  HelpCircle,
  Sparkles,
  Zap,
  Filter,
} from 'lucide-react';

interface IntelligencePanelProps {
  decisions: DecisionItem[];
  tasks: TaskItem[];
  questions: QuestionItem[];
  onCatchMeUp: () => void;
  onTaskStatusChange?: (id: string, status: TaskItem['status']) => void;
  onTaskEditTitle?: (id: string, title: string) => void;
  onResolveQuestion?: (id: string, answer?: string) => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  decisions,
  tasks,
  questions,
  onCatchMeUp,
  onTaskStatusChange,
  onTaskEditTitle,
  onResolveQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'decisions' | 'tasks' | 'questions'>('all');

  const pendingTasksCount = tasks.filter((t) => t.status === 'pending').length;
  const unresolvedQuestionsCount = questions.filter((q) => !q.isResolved).length;

  return (
    <div className="flex h-full flex-col bg-[#141619] rounded-xl border border-[#26292F] overflow-hidden">
      {/* Header with prominent Catch Me Up button */}
      <div className="border-b border-[#26292F] p-4 bg-[#141619]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#5B7FFF]" />
            <h3 className="text-sm font-bold text-[#EDEFF2]">Intelligence</h3>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={onCatchMeUp}
            icon={<Sparkles className="h-3.5 w-3.5" />}
            className="shadow-sm shadow-[#5B7FFF]/25"
          >
            Catch Me Up
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#1C1F24] text-[#EDEFF2] border border-[#26292F]'
                : 'text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24]/50'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'decisions'
                ? 'bg-[#1C1F24] text-[#3ECF8E] border border-[#3ECF8E]/30'
                : 'text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24]/50'
            }`}
          >
            <span>Decisions</span>
            <span className="rounded-full bg-[#1C1F24] px-1.5 text-[10px] text-[#A3AAB5]">
              {decisions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'tasks'
                ? 'bg-[#1C1F24] text-[#5B7FFF] border border-[#5B7FFF]/30'
                : 'text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24]/50'
            }`}
          >
            <span>Tasks</span>
            {pendingTasksCount > 0 ? (
              <span className="rounded-full bg-[#5B7FFF]/20 text-[#5B7FFF] px-1.5 text-[10px]">
                {pendingTasksCount}
              </span>
            ) : (
              <span className="rounded-full bg-[#1C1F24] px-1.5 text-[10px] text-[#A3AAB5]">
                {tasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'questions'
                ? 'bg-[#1C1F24] text-[#E3A54A] border border-[#E3A54A]/30'
                : 'text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24]/50'
            }`}
          >
            <span>Questions</span>
            {unresolvedQuestionsCount > 0 ? (
              <span className="rounded-full bg-[#E3A54A]/20 text-[#E3A54A] px-1.5 text-[10px]">
                {unresolvedQuestionsCount}
              </span>
            ) : (
              <span className="rounded-full bg-[#1C1F24] px-1.5 text-[10px] text-[#A3AAB5]">
                {questions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* DECISIONS SECTION */}
        {(activeTab === 'all' || activeTab === 'decisions') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#EDEFF2]">
              <span className="flex items-center gap-1.5 text-[#3ECF8E]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Decisions Detected
              </span>
              <span className="text-[#A3AAB5]">{decisions.length}</span>
            </div>

            {decisions.length === 0 ? (
              <EmptyState
                compact
                icon={<CheckCircle2 className="h-4 w-4" />}
                title="No decisions logged yet"
                description="When the team reaches consensus or decides on an action, WOW automatically captures it here."
              />
            ) : (
              <div className="space-y-2.5">
                {decisions.map((dec) => (
                  <DecisionCard key={dec.id} decision={dec} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TASKS SECTION */}
        {(activeTab === 'all' || activeTab === 'tasks') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#EDEFF2]">
              <span className="flex items-center gap-1.5 text-[#5B7FFF]">
                <ListTodo className="h-3.5 w-3.5" />
                Tasks & Commitments
              </span>
              <span className="text-[#A3AAB5]">{tasks.length}</span>
            </div>

            {tasks.length === 0 ? (
              <EmptyState
                compact
                icon={<ListTodo className="h-4 w-4" />}
                title="No tasks identified"
                description="Assigned action items with owners and target deadlines will appear here for one-click confirmation."
              />
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskStatusChange}
                    onEditTitle={onTaskEditTitle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUESTIONS SECTION */}
        {(activeTab === 'all' || activeTab === 'questions') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#EDEFF2]">
              <span className="flex items-center gap-1.5 text-[#E3A54A]">
                <HelpCircle className="h-3.5 w-3.5" />
                Questions & Unknowns
              </span>
              <span className="text-[#A3AAB5]">{questions.length}</span>
            </div>

            {questions.length === 0 ? (
              <EmptyState
                compact
                icon={<HelpCircle className="h-4 w-4" />}
                title="No unresolved questions"
                description="Open questions or blockers raised in dialogue are flagged so nothing slips through."
              />
            ) : (
              <div className="space-y-2.5">
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onResolve={onResolveQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
