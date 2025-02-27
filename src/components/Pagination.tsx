import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Generate page numbers with ellipsis for large page counts
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return pages;
        }

        if (currentPage <= 3) {
            return [...pages.slice(0, 4), '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, '...', ...pages.slice(totalPages - 4)];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 disabled:hover:bg-white"
                aria-label="Page précédente"
            >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            <div className="flex items-center space-x-1">
                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
              ...
            </span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(page as number)}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                                currentPage === page
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 disabled:hover:bg-white"
                aria-label="Page suivante"
            >
                <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
        </div>
    );
}