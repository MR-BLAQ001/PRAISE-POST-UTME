import type { Metadata } from "next";
import { ExamRunner } from "@/components/exam/exam-runner";

export const metadata: Metadata = {
  title: "Examination in progress",
  description: "Complete your timed CBT simulation or practice session."
};

export default function ExamRunPage() {
  return <ExamRunner />;
}
