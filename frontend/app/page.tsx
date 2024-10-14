import Search from "@/components/search";
import TasksSection from "@/components/tasks/tasksSection";
import TimeAverage from "@/components/timeAverage";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] pt-16 relative overflow-x-hidden min-h-screen">
      <TasksSection />
      <TimeAverage />
    </div>
  );
}
