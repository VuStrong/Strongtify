"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { MdSearch } from "react-icons/md";

import { PagedResponse } from "@/types/paging";
import useDebounce from "@/hooks/useDebounce";
import Pagination from "./Pagination";

interface ColumnProps {
    name: string;
    displayName: string;
    render?: (data: any) => React.ReactNode;
}

interface TableItemProps {
    itemName?: string;

    readonly?: boolean;

    columns: ColumnProps[];

    createPage?: string;

    generateItemLink?: (item: any) => string;

    onLoadItems: (
        page: number,
        size: number,
    ) => Promise<PagedResponse<any> | null>;
    onSearchItems: (
        value: string,
        page: number,
        size: number,
    ) => Promise<PagedResponse<any> | null>;

    itemPerPage?: number;
}

/**
 * Render a table for CRUD operation
 */
const TableItem: React.FC<TableItemProps> = ({
    itemName,
    readonly,
    columns,
    createPage,
    generateItemLink,
    onLoadItems,
    onSearchItems,
    itemPerPage = 1,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalItem, setTotalItem] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>("");
    const [items, setItems] = useState<any[] | null>();

    const tableRef = useRef<HTMLDivElement>(null);

    const searchValue = useDebounce(searchText, 1000, () => {
        setPage(1);
    });

    const totalPage = useMemo(() => {
        return Math.ceil(totalItem / itemPerPage);
    }, [totalItem]);

    const router = useRouter();

    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);

            const loadedItems = searchValue
                ? await onSearchItems(searchValue, page, itemPerPage)
                : await onLoadItems(page, itemPerPage);

            setIsLoading(false);

            if (loadedItems === null) return;

            setItems(loadedItems.results);
            setTotalItem(loadedItems.total);
        };

        loadItems();
    }, [page, searchValue]);

    return (
        <div id="TableItem" ref={tableRef}>
            {!readonly && (
                <Link
                    href={createPage ?? "/"}
                    className="rounded-md bg-success px-3 py-2"
                >
                    Add new {itemName}
                </Link>
            )}

            <div className="relative md:float-right md:mt-0 mt-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MdSearch size={24} />
                </div>
                <input
                    type="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-primary"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
            </div>

            <br className="clear-right" />
            <p className="text-yellow-50 mt-3">{totalItem} kết quả</p>
            <div className="relative overflow-x-auto mb-6">
                <table className="w-full text-sm text-left">
                    <thead className="text-xl text-yellow-50 border-b border-gray-700">
                        <tr>
                            {columns?.map((col) => (
                                <th key={col.name} className="px-6 py-6">
                                    {col.displayName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoading &&
                            columns &&
                            items?.map((item, i) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-700 text-gray-400 cursor-pointer hover:underline"
                                    onClick={() => {
                                        generateItemLink &&
                                            router.push(generateItemLink(item));
                                    }}
                                >
                                    {columns.map((col, j) =>
                                        !col.render ? (
                                            <td
                                                key={`${i}${j}`}
                                                className="px-6 py-4 font-medium whitespace-nowrap"
                                            >
                                                {item[col.name]}
                                            </td>
                                        ) : (
                                            <td
                                                key={`${i}${j}`}
                                                className="p-2 font-medium whitespace-nowrap"
                                            >
                                                {col.render(item[col.name])}
                                            </td>
                                        ),
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>
                
                {!isLoading && items && !items[0] && (
                    <div className="text-yellow-50">Không có kết quả</div>
                )}

                {isLoading && (
                    <div className="w-full">
                        <Skeleton
                            count={itemPerPage}
                            highlightColor="#f58c1b"
                            baseColor="#121212"
                        />
                    </div>
                )}
            </div>

            <Pagination
                page={page}
                totalPage={totalPage}
                onPageChange={(page) => {
                    setPage(page);

                    if (tableRef.current) {
                        tableRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                }}
            />
        </div>
    );
};

export default TableItem;
