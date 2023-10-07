"use client";

import { FormEvent, useEffect, useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

export default function Pagination({
    page = 1,
    totalPage = 1,
    onPageChange,
}: {
    page?: number;
    totalPage?: number;
    onPageChange: (page: number) => void;
}) {
    const [pageNumber, setPageNumber] = useState<string>(page.toString());

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let number = pageNumber ? +pageNumber : 1;

        if (number <= 0) number = 1;
        else if (number > totalPage) number = totalPage;

        onPageChange(number);
    };

    useEffect(() => {
        setPageNumber(page.toString());
    }, [page]);

    return (
        <div className="flex gap-x-3">
            <div
                onClick={() => {
                    page > 1 && onPageChange(page - 1);
                }}
                className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
            >
                <MdArrowBackIosNew size={20} />
            </div>

            <div className="flex">
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        value={pageNumber}
                        onChange={(e) => {
                            setPageNumber(e.target.value);
                        }}
                        className="text-center w-[40px] h-[40px]"
                    />
                </form>
                <span className="text-center leading-[40px] text-gray-500 bg-white w-[40px] h-[40px]">
                    {" "}
                    / {totalPage}
                </span>
            </div>

            <div
                onClick={() => {
                    page < totalPage && onPageChange(page + 1);
                }}
                className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
            >
                <MdArrowForwardIos size={20} />
            </div>
        </div>
    );
}
