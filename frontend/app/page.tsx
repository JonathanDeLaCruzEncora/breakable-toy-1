import Search from "@/components/search";
import TasksSection from "@/components/tasksSection";
import TimeAverage from "@/components/timeAverage";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] pt-16 overflow-x-hidden">
      <Search />
      <TasksSection />
      <TimeAverage />
    </div>
  );
}
