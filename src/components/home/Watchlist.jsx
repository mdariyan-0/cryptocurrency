import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Star,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWatchlist } from "../../redux/slices/watchlistSlice";
import { displayToast } from "../../redux/slices/toastSlice";

const Watchlist = () => {
  let watchlist = useSelector((state) => state.watchlist);
  let dispatch = useDispatch();
  let data = useSelector((state) => state.data);
  let tableData = useMemo(
    () => watchlist.map((symbol) => data[symbol]).filter(Boolean),
    [watchlist, data],
  );
  const columns = useMemo(
    () => [
      {
        id: "icon",
        header: "",
        cell: (info) => (
          <div
            title="Remove from Watchlist"
            className="cursor-pointer"
            onClick={() => {
              dispatch(removeFromWatchlist(info.row.original.symbol));
              dispatch(
                displayToast(
                  `${info.row.original.symbol} removed from watchlist`,
                ),
              );
            }}
          >
            <Star className="text-yellow-400" />
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "serial",
        header: "#",
        cell: (info) =>
          info.table.getSortedRowModel().flatRows.indexOf(info.row) + 1,
        enableSorting: false,
      },
      {
        accessorKey: "symbol",
        header: "Coin",
      },

      {
        accessorKey: "lastPrice",
        header: "Price",
        cell: (info) => {
          let price = Number(info.getValue()).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          let decimalPart =
            String(Number(info.getValue()).toFixed(2)).split(".")[1] || "00";
          return (
            <span>
              $ {price}.
              <span className="text-gray-500 text-sm">{decimalPart}</span>
            </span>
          );
        },
      },
      {
        accessorKey: "priceChange",
        header: "Price Change",
        cell: (info) => {
          let value = Number(info.getValue());
          let price = Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          let decimalPart = String(value.toFixed(2)).split(".")[1] || "00";
          return (
            <span
              className={
                value > 0
                  ? "text-green-500"
                  : value < 0
                    ? "text-red-500"
                    : "text-white"
              }
            >
              {value > 0 ? "+" : ""}
              {price}.
              <span className="text-inherit text-sm">{decimalPart} $</span>
            </span>
          );
        },
      },
      {
        accessorKey: "priceChangePercent",
        header: "Change %",
        cell: (info) => {
          let changePercent = Number(info.getValue()).toFixed(2);
          return (
            <span
              className={
                changePercent > 0
                  ? "text-green-500"
                  : changePercent < 0
                    ? "text-red-500"
                    : "text-white"
              }
            >
              {changePercent > 0 ? "+" : ""}
              {changePercent}%
            </span>
          );
        },
      },
      {
        accessorKey: "quoteVolume",
        header: "Volume(24h)",
        cell: (info) => {
          let price = Number(info.getValue()).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          let value = Number(info.getValue());
          let decimalPart =
            String(Number(value.toFixed(2))).split(".")[1] || "00";
          return (
            <span>
              $ {price}.
              <span className="text-gray-500 text-sm">{decimalPart}</span>
            </span>
          );
        },
      },
    ],
    [],
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
    },

    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    console.log(tableData);
  }, [watchlist]);

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-content p-4">
        <h2 className="text-3xl">
          Your <span className="text-[#8884d8]  font-semibold">Watchlist</span>
        </h2>
        <p className=" mt-3">
          Currencies you add to your watchlist will appear here.
        </p>
      </div>
    );
  }
  return (
    <div className="watchlist-content p-4">
      <h2 className="text-3xl pb-3">
        Your <span className="text-[#8884d8] font-semibold">Watchlist</span>
      </h2>
      <table>
        <thead className="bg-[#222] text-white sticky top-[42px] z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center justify-center gap-1"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: <ChevronUp size={16} />,
                        desc: <ChevronDown size={16} />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {tableData.length > 0 ? (
        <div className="pagination flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500 w-[33%]">
            Showing{" "}
            <span className="font-bold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="font-bold">{table.getPageCount()}</span> pages
          </p>
          <div className="flex items-center gap-2 justify-center w-[33%]">
            <button
              onClick={() => table.previousPage()}
              className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </button>

            <span className="text-white block px-4 py-1 rounded-md bg-[rgba(138,133,232,0.5)] text-base">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="pages w-[33%] flex items-center justify-end gap-2">
            <select
              name="pages"
              className="bg-black border border-gray-500 rounded text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[20, 50, 100, 200].map((_) => (
                <option
                  key={_}
                  value={_}
                  className={`px-3 rounded-sm py-1 bg-black border border-gray-500 text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer ${table.getState().pagination.pageSize === _ ? "bg-[rgba(138,133,232,0.5)] text-[#8884d8]" : ""}`}
                >
                  {_}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Watchlist;
