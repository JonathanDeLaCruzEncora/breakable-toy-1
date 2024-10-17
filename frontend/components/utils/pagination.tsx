import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { getTasks } from "./api";
import { Task } from "../tasks/tasksSection";
import { pages } from "next/dist/build/templates/app-page";

interface PaginationProps {
  numberOfPages: number;
  setNumberOfPages: (pages: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  sortCompleted: boolean;
  sortName: number;
  sortDueDate: number;
  sortPriority: number;
  searchParams: object;
  setLoadingTasks: (val: boolean) => void;
  setTaskList: (val: Task[]) => void;
}

const Pagination = ({
  sortCompleted,
  sortName,
  sortDueDate,
  sortPriority,
  searchParams,
  setLoadingTasks,
  setTaskList,
  numberOfPages,
  currentPage,
  setNumberOfPages,
  setCurrentPage,
}: PaginationProps) => {
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= numberOfPages) {
      try {
        setCurrentPage(page);
        setLoadingTasks(true);
        const filtersAndSort = {
          ...searchParams,
          sortCompleted,
          sortName,
          sortPriority,
          sortDueDate,
        };
        let nextList = [];

        const { tasks: fetchedTasks } = await getTasks(
          page - 1,
          filtersAndSort,
        );

        nextList = fetchedTasks;
        if (fetchedTasks.length == 0 && page > 1) {
          const { tasks: fetchedTasksPrev } = await getTasks(
            page - 2,
            filtersAndSort,
          );
          nextList = fetchedTasksPrev;
          setNumberOfPages(numberOfPages - 1);
          setCurrentPage(page - 1);
        }
        setTaskList(nextList);
        setLoadingTasks(false);
      } catch (error) {
        setLoadingTasks(false);
        console.error(error);
      }
    }
  };

  const getPages = () => {
    let pages = [];

    if (numberOfPages <= 5) {
      for (let i = 1; i <= numberOfPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(numberOfPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < numberOfPages - 2) pages.push("...");

      // Add last page
      pages.push(numberOfPages);
    }

    return pages;
  };

  return (
    <div className="mx-auto flex w-min items-center justify-center overflow-hidden rounded-2xl border">
      <button
        className={`cursor-pointer py-0.5 pl-1 pr-1 text-slate-400 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-default disabled:bg-slate-50 disabled:hover:bg-slate-50 disabled:active:bg-slate-50`}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdNavigateBefore
          size={22}
          color={currentPage === 1 ? "#94a3b8" : "#64748b"}
        />
      </button>
      {getPages().map((page, index) => (
        <button
          key={index}
          className={`border-l px-2 ${
            page === "..."
              ? "disabled:hover:bg-white disabled:active:bg-white"
              : ""
          } ${
            currentPage === page
              ? "bg-slate-50 font-bold text-indigo-400"
              : "text-slate-500 hover:bg-slate-50 active:bg-slate-100"
          }`}
          onClick={() => typeof page === "number" && goToPage(page)}
          disabled={page === "..." || currentPage === page}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        className={`cursor-pointer border-l py-0.5 pl-1 pr-1 text-slate-400 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-default disabled:bg-slate-50 disabled:hover:bg-slate-50 disabled:active:bg-slate-50`}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === numberOfPages}
      >
        <MdNavigateNext
          size={22}
          color={currentPage === numberOfPages ? "#94a3b8" : "#64748b"}
        />
      </button>
    </div>
  );
};

export default Pagination;
