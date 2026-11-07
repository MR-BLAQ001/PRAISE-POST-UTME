"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  ChevronDown,
  Lightbulb,
  Loader2,
  NotebookPen,
  Pencil,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { SubjectIcon } from "@/components/subjects/subject-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useApp } from "@/components/providers/app-provider";
import { useToast } from "@/components/providers/toast-provider";
import { subjectName } from "@/lib/subjects";
import { cn, DIFFICULTY_LABEL, formatDateTime } from "@/lib/utils";
import type { Note } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];
type Tab = "bookmarks" | "notes";

export default function LibraryPage() {
  const toast = useToast();
  const {
    user,
    db,
    questionBank,
    bookmark,
    userNotes,
    createOrUpdateNote,
    removeNote
  } = useApp();

  const [tab, setTab] = useState<Tab>("bookmarks");
  const [query, setQuery] = useState("");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [noteModal, setNoteModal] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteBusy, setNoteBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const bookmarks = useMemo(() => {
    if (!db || !user) return [];
    return db.bookmarks
      .filter((entry) => entry.userId === user.id)
      .map((entry) => ({
        ...entry,
        question: questionBank.find((question) => question.id === entry.questionId) ?? null
      }))
      .filter((entry) => entry.question !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [db, user, questionBank]);

  const filteredBookmarks = bookmarks.filter((entry) => {
    if (!query.trim() || !entry.question) return true;
    const needle = query.trim().toLowerCase();
    return (
      entry.question.text.toLowerCase().includes(needle) ||
      entry.question.topic.toLowerCase().includes(needle) ||
      subjectName(entry.question.subject).toLowerCase().includes(needle)
    );
  });

  const filteredNotes = userNotes.filter((note) => {
    if (!query.trim()) return true;
    const needle = query.trim().toLowerCase();
    return (
      note.title.toLowerCase().includes(needle) || note.body.toLowerCase().includes(needle)
    );
  });

  if (!user) return null;

  const openCreate = () => {
    setEditing(null);
    setNoteTitle("");
    setNoteBody("");
    setNoteModal(true);
  };

  const openEdit = (note: Note) => {
    setEditing(note);
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setNoteModal(true);
  };

  const saveNote = () => {
    if (!noteBody.trim()) {
      toast.error("Note is empty", "Write something worth revising later.");
      return;
    }
    setNoteBusy(true);
    const outcome = createOrUpdateNote({
      id: editing?.id,
      questionId: editing?.questionId ?? null,
      title: noteTitle.trim() || "Untitled note",
      body: noteBody.trim()
    });
    setNoteBusy(false);
    if (outcome.ok) {
      toast.success(editing ? "Note updated" : "Note created", "Your library has been updated.");
      setNoteModal(false);
    } else {
      toast.error("Could not save note", outcome.error);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Revision library"
        title="Bookmarks & notes"
        description="Everything you saved for later, in one place. Bookmarks link straight back to the question; notes are your own words."
        actions={
          <button type="button" onClick={openCreate} className="btn-primary">
            <Plus className="h-4 w-4" />
            New note
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab("bookmarks")}
            aria-pressed={tab === "bookmarks"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              tab === "bookmarks"
                ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                : "border-line/15 text-muted hover:text-ink"
            )}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Bookmarks ({bookmarks.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("notes")}
            aria-pressed={tab === "notes"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              tab === "notes"
                ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                : "border-line/15 text-muted hover:text-ink"
            )}
          >
            <NotebookPen className="h-3.5 w-3.5" />
            Notes ({userNotes.length})
          </button>
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tab === "bookmarks" ? "Search bookmarks" : "Search notes"}
            aria-label="Search library"
            className="input h-9 pl-8 text-xs"
          />
        </div>
      </div>

      {tab === "bookmarks" ? (
        filteredBookmarks.length ? (
          <div className="space-y-3">
            {filteredBookmarks.map((entry) => {
              const question = entry.question;
              if (!question) return null;
              const isOpen = revealed[question.id] ?? false;
              return (
                <div key={entry.questionId} className="card p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <SubjectIcon subject={question.subject} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-ink">
                          {subjectName(question.subject)}
                        </span>
                        <span className="chip">{question.topic}</span>
                        <Badge
                          tone={
                            question.difficulty === "hard"
                              ? "danger"
                              : question.difficulty === "medium"
                                ? "warning"
                                : "success"
                          }
                        >
                          {DIFFICULTY_LABEL[question.difficulty]}
                        </Badge>
                        <span className="text-[10px] text-muted">
                          saved {formatDateTime(entry.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-ink">
                        {question.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        bookmark(question.id);
                        toast.info("Bookmark removed");
                      }}
                      aria-label="Remove bookmark"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line/15 text-muted transition hover:border-rose-500/40 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((current) => ({
                          ...current,
                          [question.id]: !isOpen
                        }))
                      }
                      aria-expanded={isOpen}
                      className="btn-ghost text-[11px]"
                    >
                      <ChevronDown className={cn("h-3.5 w-3.5 transition", isOpen && "rotate-180")} />
                      {isOpen ? "Hide answer" : "Reveal answer & explanation"}
                    </button>
                  </div>

                  {isOpen ? (
                    <div className="mt-2 space-y-1.5">
                      {question.options.map((option, index) => (
                        <div
                          key={`${question.id}-${index}`}
                          className={cn(
                            "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                            index === question.correctIndex
                              ? "border-emerald-500/40 bg-emerald-500/10 text-ink"
                              : "border-line/10 text-muted"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-4 w-4 shrink-0 place-items-center rounded text-[9px] font-bold",
                              index === question.correctIndex
                                ? "bg-emerald-500 text-white"
                                : "border border-line/20 text-muted"
                            )}
                          >
                            {index === question.correctIndex ? (
                              <Check className="h-2.5 w-2.5" />
                            ) : (
                              LETTERS[index]
                            )}
                          </span>
                          {option}
                        </div>
                      ))}
                      <div className="rounded-lg border border-brand-500/20 bg-brand-500/[0.06] p-2.5">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-brand-300">
                          <Lightbulb className="h-3 w-3" />
                          Explanation
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted">
                          {question.explanation}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(null);
                            setNoteTitle(`${question.topic} — ${subjectName(question.subject)}`);
                            setNoteBody("");
                            setNoteModal(true);
                          }}
                          className="btn-ghost text-[10px]"
                        >
                          <NotebookPen className="h-3 w-3" />
                          Add note
                        </button>
                        <Link
                          href={`/subjects/${question.subject}`}
                          className="btn-ghost text-[10px]"
                        >
                          <BookOpen className="h-3 w-3" />
                          Study subject
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Bookmark}
            title={bookmarks.length ? "No bookmarks match your search" : "No bookmarks yet"}
            description={
              bookmarks.length
                ? "Try a different search term."
                : "Tap the bookmark icon on any question — during an exam, in a result review, or in the subject browser — and it will appear here."
            }
            action={{ label: "Browse subjects", href: "/subjects" }}
          />
        )
      ) : filteredNotes.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => {
            const linked = note.questionId
              ? questionBank.find((question) => question.id === note.questionId)
              : null;
            return (
              <div key={note.id} className="card flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/10 text-violet-400">
                      <NotebookPen className="h-3.5 w-3.5" />
                    </span>
                    <Badge tone="neutral">{linked ? "Linked" : "General"}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(note)}
                      aria-label="Edit note"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-line/15 text-muted transition hover:text-ink"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(note)}
                      aria-label="Delete note"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-line/15 text-muted transition hover:border-rose-500/40 hover:text-rose-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-ink">{note.title}</p>
                <p className="mt-1 line-clamp-4 flex-1 whitespace-pre-wrap text-xs leading-relaxed text-muted">
                  {note.body}
                </p>
                {linked ? (
                  <Link
                    href={`/subjects/${linked.subject}`}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-brand-400 hover:text-brand-300"
                  >
                    {subjectName(linked.subject)} · {linked.topic}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : null}
                <p className="mt-2 text-[10px] text-muted">Updated {formatDateTime(note.updatedAt)}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={NotebookPen}
          title={userNotes.length ? "No notes match your search" : "No notes yet"}
          description={
            userNotes.length
              ? "Try a different search term."
              : "Write short revision notes for the concepts that keep slipping. Link a note to a question from any result review."
          }
          action={
            <button type="button" onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" />
              Create your first note
            </button>
          }
        />
      )}

      <div className="card border-brand-500/20 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
          <BookmarkCheck className="h-3.5 w-3.5 text-brand-400" />
          A library that stays yours
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Bookmarks and notes are stored locally in demo mode and only ever shown to you. Your email
          address is never displayed on public leaderboards.
        </p>
      </div>

      <Modal
        open={noteModal}
        onClose={() => setNoteModal(false)}
        title={editing ? "Edit note" : "New revision note"}
        description="Keep it short and specific. Future you will thank present you."
        footer={
          <>
            <button type="button" onClick={() => setNoteModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={saveNote} className="btn-primary" disabled={noteBusy}>
              {noteBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {editing ? "Save changes" : "Create note"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="library-note-title" className="label">
              Title
            </label>
            <input
              id="library-note-title"
              className="input"
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              placeholder="e.g. Newton's second law traps"
            />
          </div>
          <div>
            <label htmlFor="library-note-body" className="label">
              Note
            </label>
            <textarea
              id="library-note-body"
              className="input min-h-[140px] resize-y"
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              placeholder="Write the idea in your own words, then one example."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this note?"
        description="This cannot be undone."
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary">
              Keep note
            </button>
            <button
              type="button"
              className="btn-primary bg-gradient-to-r from-rose-500 to-rose-700"
              onClick={() => {
                if (!deleteTarget) return;
                removeNote(deleteTarget.id);
                setDeleteTarget(null);
                toast.info("Note deleted");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete note
            </button>
          </>
        }
      >
        <p className="text-xs leading-relaxed text-muted">
          &ldquo;{deleteTarget?.title}&rdquo; will be removed from your library.
        </p>
      </Modal>
    </div>
  );
}
