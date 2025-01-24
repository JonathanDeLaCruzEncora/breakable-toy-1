export interface Task {
  id: number;
  completed: boolean;
  name: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  completedAt: string;
}

export interface SearchParams {
  name: string;
  priority: string;
  state: string;
}

export interface PriorityAvg {
  High: number;
  Medium: number;
  Low: number;
}

export interface NewTask {
  name: string;
  priority: string;
  dueDate: string;
}

export interface ContextProps {
  tasks: Task[];
  sortCompleted: boolean;
  sortName: number;
  sortPriority: number;
  sortDueDate: number;
  currentPage: number;
  loadingTasks: boolean;
  numberOfPages: number;
  avgTime: number;
  priorityAvg: PriorityAvg;
  searchParams: SearchParams;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSortCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setSortName: React.Dispatch<React.SetStateAction<number>>;
  setSortPriority: React.Dispatch<React.SetStateAction<number>>;
  setSortDueDate: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setLoadingTasks: React.Dispatch<React.SetStateAction<boolean>>;
  setNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
  setAvgTime: React.Dispatch<React.SetStateAction<number>>;
  setPriorityAvg: React.Dispatch<React.SetStateAction<PriorityAvg>>;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
}
