"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock3,
  Flag,
  Plus,
  Target,
  Trash2,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { weeklyReport } from "@/lib/performance";
import { UNIVERSITIES } from "@/lib/universities";
import { SUBJECTS } from "@/lib/subjects";
import { formatDate, percentage } from "@/lib/utils";

export default function PlannerPage() {
  const toast = useToast();
  const {
    user,
    plan,
    updatePlan,
    addTask,
    toggleTask,
    removeTask,
    userResults,
    userPractice
  } = useApp();

  const [examDate, setExamDate] = useState(plan.examDate ?? "");
  const [targetUniversityId, setTargetUniversityId] = useState(plan.targetUniversityId ?? "");
  const [weeklyGoal, setWeeklyGoal] = useState(plan.weeklyGoal || 5);
  const [savingGoal, setSavingGoal] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState(user?.preferredSubjects[0] ?? "english-language");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const weekly = useMemo(
    () => (user ? weeklyReport(userResults, userPractice, user.id) : null),
    [userResults, userPractice, user]
  );

  if (!user) return null;

  const tasks = [...plan.tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  const completed = plan.tasks.filter((task) => task.done).length;
  const taskProgress = plan.tasks.length ? percentage(completed, plan.tasks.length) : 0;
  const goalProgress = weeklyGoal
    ? Math.min(100, Math.round((((weekly?.exams ?? 0) + userPractice.length / 10) / weeklyGoal) * 100))
    : 0;
  const daysToExam = plan.examDate
    ? Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / 86_400_000)
    : null;
  const target = UNIVERSITIES.find((item) => item.id === plan.targetUniversityId);

  const savePlan = () => {
    setSavingGoal(true);
    updatePlan({
      ...plan,
      examDate: examDate || null,
      targetUniversityId: targetUniversityId || null,
      weeklyGoal: Math.max(1, Math.min(30, weeklyGoal))
    });
    setSavingGoal(false);
    toast.success("Plan updated", "Your target date and weekly goal are saved.");
  };

  const submitTask = () => {
    setError(null);
    if (taskTitle.trim().length < 3) {
      setError("Give the task a clear title (at least three characters).");
      return;
    }
    const outcome = addTask({
      title: taskTitle.trim(),
      subject: taskSubject,
      dueDate: new Date(`${taskDate}T12:00:00`).toISOString()
    });
    if (!outcome.ok) {
      setError(outcome.error ?? "Could not add the task.");
      return;
    }
    toast.success("Task added", "It is now part of your study plan.");
    setTaskTitle("");
    setTaskOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Study planner"
        title="Plan the work. Work the plan."
        description="Set your target exam date, choose a weekly session goal and break revision into small, checkable tasks."
        actions={
          <button type="button" onClick={() => setTaskOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            Add task
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <CalendarCheck className="h-3.5 w-3.5 text-brand-400" />
            Exam countdown
          </p>
          <p className="mt-1 text-xl font-bold text-ink">
            {daysToExam === null
              ? "Not set"
              : daysToExam > 0
                ? `${daysToExam} days`
                : daysToExam === 0
                  ? "Today"
                  : "Date passed"}
          </p>
          <p className="text-[10px] text-muted">
            {plan.examDate ? formatDate(plan.examDate, { day: "numeric", month: "long", year: "numeric" }) : "Add a target date below"}
          </p>
        </div>
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <Target className="h-3.5 w-3.5 text-rose-400" />
            Weekly goal
          </p>
          <p className="mt-1 text-xl font-bold text-ink">{goalProgress}%</p>
          <Progress value={goalProgress} className="mt-1.5 h-1.5" />
        </div>
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Tasks completed
          </p>
          <p className="mt-1 text-xl font-bold text-ink">
            {completed} / {plan.tasks.length}
          </p>
          <Progress value={taskProgress} className="mt-1.5 h-1.5" />
        </div>
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
            This week&apos;s average
          </p>
          <p className="mt-1 text-xl font-bold text-ink">{weekly?.average ?? 0}%</p>
          <p className="text-[10px] text-muted">
            {weekly?.exams ?? 0} exams · {weekly?.questions ?? 0} questions
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-ink">Study tasks</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  Small, specific actions beat vague intentions.
                </p>
              </div>
              <Badge tone={taskProgress === 100 && plan.tasks.length ? "success" : "neutral"}>
                {taskProgress}% done
              </Badge>
            </div>

            {tasks.length ? (
              <div className="mt-3 divide-y divide-line/10">
                {tasks.map((task) => {
                  const overdue =
                    !task.done && new Date(task.dueDate).getTime() < Date.now();
                  const subject = SUBJECTS.find((item) => item.slug === task.subject);
                  return (
                    <div key={task.id} className="flex items-start gap-3 py-3">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={task.done ? "Mark task incomplete" : "Mark task complete"}
                        className="mt-0.5 shrink-0"
                      >
                        {task.done ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted transition hover:text-brand-400" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            task.done
                              ? "text-sm font-medium text-muted line-through"
                              : "text-sm font-medium text-ink"
                          }
                        >
                          {task.title}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="chip">{subject?.shortName ?? task.subject}</span>
                          <span
                            className={
                              overdue
                                ? "text-[10px] font-medium text-rose-400"
                                : "text-[10px] text-muted"
                            }
                          >
                            {overdue ? "Overdue · " : "Due "}
                            {formatDate(task.dueDate, { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeTask(task.id);
                          toast.info("Task removed");
                        }}
                        aria-label="Delete task"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line/15 text-muted transition hover:border-rose-500/40 hover:text-rose-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-line/20 p-8 text-center">
                <Flag className="mx-auto h-7 w-7 text-muted/50" />
                <p className="mt-2 text-sm font-medium text-ink">No study tasks yet</p>
                <p className="mt-1 text-xs text-muted">
                  Add your first task — a topic to revise, a past paper to complete or a subject to
                  drill.
                </p>
                <button type="button" onClick={() => setTaskOpen(true)} className="btn-primary mt-4 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Add a task
                </button>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Set your plan</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Dates and goals stay on this device. You can change them any time.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="planner-date" className="label">
                  Target exam date
                </label>
                <input
                  id="planner-date"
                  type="date"
                  className="input"
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="planner-goal" className="label">
                  Weekly sessions goal
                </label>
                <input
                  id="planner-goal"
                  type="number"
                  min={1}
                  max={30}
                  className="input"
                  value={weeklyGoal}
                  onChange={(event) => setWeeklyGoal(Number(event.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="planner-university" className="label">
                  Target university
                </label>
                <select
                  id="planner-university"
                  className="input"
                  value={targetUniversityId}
                  onChange={(event) => setTargetUniversityId(event.target.value)}
                >
                  <option value="">No target university</option>
                  {UNIVERSITIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" onClick={savePlan} className="btn-primary mt-3" disabled={savingGoal}>
              {savingGoal ? "Saving…" : "Save plan"}
            </button>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Target className="h-4 w-4 text-brand-400" />
              This week
            </p>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">CBTs completed</span>
                <span className="font-bold text-ink">{weekly?.exams ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Questions answered</span>
                <span className="font-bold text-ink">{weekly?.questions ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Time studied</span>
                <span className="font-bold text-ink">{weekly?.minutes ?? 0} min</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Average score</span>
                <span className="font-bold text-ink">{weekly?.average ?? 0}%</span>
              </div>
            </div>
            {weekly?.change !== null && weekly?.change !== undefined ? (
              <p
                className={
                  weekly.change >= 0
                    ? "mt-2 text-[11px] text-emerald-400"
                    : "mt-2 text-[11px] text-rose-400"
                }
              >
                {weekly.change >= 0 ? "Up" : "Down"} {Math.abs(weekly.change)} points vs last week
              </p>
            ) : (
              <p className="mt-2 text-[11px] text-muted">
                Complete sessions across two weeks to compare progress.
              </p>
            )}
            <Link href="/practice" className="btn-primary mt-3 w-full text-xs">
              Start a session
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {target ? (
            <div className="card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Flag className="h-4 w-4 text-cyan-400" />
                Target university
              </p>
              <p className="mt-1 text-sm font-bold text-ink">{target.name}</p>
              <p className="text-[11px] text-muted">
                {target.city}, {target.state} State
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                {target.abbreviation} publishes current requirements each year. Verify subject
                combinations and screening dates on the official site.
              </p>
              <Link href={`/universities/${target.id}`} className="btn-secondary mt-3 w-full text-xs">
                Open university guide
              </Link>
            </div>
          ) : (
            <div className="card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Flag className="h-4 w-4 text-muted" />
                No target university
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Set a target to keep its subject combinations and official link close at hand.
              </p>
              <Link href="/universities" className="btn-secondary mt-3 w-full text-xs">
                Browse universities
              </Link>
            </div>
          )}

          <div className="card border-brand-500/20 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Clock3 className="h-3.5 w-3.5 text-brand-400" />
              A realistic weekly rhythm
            </p>
            <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-muted">
              <li>2 short practice sessions on weekdays (10–15 minutes).</li>
              <li>1 subject-focused drill on your weakest topic.</li>
              <li>1 full CBT at the weekend under exam conditions.</li>
              <li>Review every wrong answer in the result page.</li>
            </ul>
          </div>
        </aside>
      </div>

      <Modal
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        title="Add a study task"
        description="Make it specific enough that future you knows exactly what to do."
        footer={
          <>
            <button type="button" onClick={() => setTaskOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={submitTask} className="btn-primary">
              <Plus className="h-4 w-4" />
              Add task
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {error ? (
            <p role="alert" className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="task-title" className="label">
              Task
            </label>
            <input
              id="task-title"
              className="input"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="e.g. Revise electrolysis and attempt 20 questions"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="task-subject" className="label">
                Subject
              </label>
              <select
                id="task-subject"
                className="input"
                value={taskSubject}
                onChange={(event) => setTaskSubject(event.target.value)}
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject.slug} value={subject.slug}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-date" className="label">
                Due date
              </label>
              <input
                id="task-date"
                type="date"
                className="input"
                value={taskDate}
                onChange={(event) => setTaskDate(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
