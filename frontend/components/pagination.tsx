"use client"; // Required for Next.js when using React hooks

import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface PaginationProps {
  totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPages = () => {
    let pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");

      // Add last page
      pages.push(totalPages);
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
        disabled={currentPage === totalPages}
      >
        <MdNavigateNext
          size={22}
          color={currentPage === totalPages ? "#94a3b8" : "#64748b"}
        />
      </button>
    </div>
  );
};

export default Pagination;
