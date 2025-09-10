import React from 'react';
import Button from './Button';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

const Pagination = ({ currentPage, totalCount, limit, onPageChange }) => {
    const totalPages = Math.ceil(totalCount / limit);
    if (totalPages < 1) return null; // No pagination needed

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex flex-wrap items-center justify-center mt-6 gap-4">
            {/* Previous Button */}
            <Button
                label={<FaChevronLeft />}
                action={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant='secondary'
                corner='full'
                size='large'
                className='!px-2'

            />

            {/* Page Numbers */}
            <div className='flex gap-2 items-center'>

                {pages.map((p) => (
                    <Button
                        label={p}
                        key={p}
                        action={() => onPageChange(p)}
                        size='small'
                        variant='medium'
                        className={`!px-3 !text-lg ${p === currentPage ? '!text-accent' : '!text-secondary/60'}`}
                    // className={`px-4 py-2 rounded-md font-medium transition-colors ${p === currentPage
                    // ? 'bg-green-500 text-white'
                    // : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    // }`}
                    >
                    </Button>
                ))}

            </div>
            {/* Next Button */}
            <Button
                label={<FaChevronRight />}
                action={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant='secondary'
                corner='full'
                size='large'
                className='!px-2'

            // className={`px-3 py-1 rounded-md font-medium transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-100`}
            />

        </div>
    );
};

export default Pagination;
