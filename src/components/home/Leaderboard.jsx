import React, { useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
const Leaderboard = () => {
  let data = useSelector((state) => state.data);
  let coins = useSelector((state) => state.coin);
  const [terms, setTerms] = React.useState(false);
  const [topGainers, setTopGainers] = React.useState([]);
  const [topLosers, setTopLosers] = React.useState([]);

  let columns = useMemo(() => [
    {
      id: "serial",
      header: "#",
      cell: (info) =>
        info.table.getSortedRowModel().flatRows.indexOf(info.row) + 1,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Coin",
      cell: (info) => (
        <div className="font-bold text-xl">{info.getValue()}</div>
      ),
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
      size: 180,
      cell: (info) => {
        let price = Number(info.getValue()).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        let value = Number(info.getValue());
        let decimalPart =
          String(Number(value.toFixed(2))).split(".")[1] || "00";
        return (
          <div className="tabular-nums">
            $ {price}.
            <span className="text-gray-500 text-sm">{decimalPart}</span>
          </div>
        );
      },
    },
  ]);

  const table1 = useReactTable({
    data: topGainers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const table2 = useReactTable({
    data: topLosers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    let topGainers = Object.values(data)
      .sort(
        (a, b) =>
          b[terms ? "priceChangePercent" : "priceChange"] -
          a[terms ? "priceChangePercent" : "priceChange"],
      )
      .slice(0, 5);
    let topLosers = Object.values(data)
      .sort(
        (a, b) =>
          a[terms ? "priceChangePercent" : "priceChange"] -
          b[terms ? "priceChangePercent" : "priceChange"],
      )
      .slice(0, 5);
    setTopGainers(topGainers);
    setTopLosers(topLosers);
  }, [terms]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="leaderboard-content p-4 relative">
    <div className="absolute top-0 right-0 justify-end flex"><button onClick={()=> setTerms(prev => !prev)} className={`px-3 py-1.5 bg-transparent cursor-pointer text-sm transition-all duration-300 ${!terms ? "border-b-2 border-[#8884d8] text-[#8884d8] font-bold" : "font-normal border-b-2 border-transparent hover:border-[#8884d8] hover:text-[#8884d8]"}`}>Sort by {terms ? "Change(%)" : "Change($)"}</button></div>
      {/*Top Gainers*/}
      <h2 className="font-semibold text-3xl pb-8 border-b-2 border-gray-700">
        Top <span className="text-[#8884d8]">Gainers</span>
      </h2>
      <table className="w-full">
        <thead className="text-sm text-gray-500 uppercase border-b border-gray-700">
          {table1.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-center pb-2"
                  style={
                    header.column.getSize() !== 150
                      ? { width: header.getSize(), minWidth: header.getSize() }
                      : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table1.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={
                    cell.column.getSize() !== 150
                      ? {
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                        }
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full h-4 py-10 bg-transparent"></div>
      <h2 className="font-semibold text-3xl pb-8 border-b-2 border-gray-700">
        Top <span className="text-[#8884d8]">Losers</span>
      </h2>
      <table>
        <thead className="text-sm text-gray-500 uppercase border-b border-gray-700">
          {table2.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-center pb-2"
                  style={
                    header.column.getSize() !== 150
                      ? { width: header.getSize(), minWidth: header.getSize() }
                      : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table2.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={
                    cell.column.getSize() !== 150
                      ? {
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                        }
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
