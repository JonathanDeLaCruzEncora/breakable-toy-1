import TasksSection from "@/components/tasks/tasksSection";
import { AppProvider } from "@/components/AppContext";
import Search from "@/components/search";
import TimeAverage from "@/components/timeAverage";

export default function Home() {
  return (
    <AppProvider>
      <div className="font-[family-name:var(--font-geist-sans)] pt-16 relative overflow-x-hidden min-h-screen">
        <Search />
        <TasksSection />
        <TimeAverage />
      </div>
    </AppProvider>
  );
}
