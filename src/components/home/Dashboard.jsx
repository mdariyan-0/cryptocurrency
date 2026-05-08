import React, { useState } from "react";
import { useSelector } from "react-redux";
import Coin from "../Coin";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const coins = useSelector((state) => state.coin);
  const [page, setPage] = useState(1);
  const [pages , setPages] = useState(20);
  return (
    <div>
      <table>
        <thead className="bg-[#222] text-white sticky top-[42px]">
          <tr className="text-right">
            <th scope="col"></th>
            <th scope="col">#</th>
            <th scope="col">Symbol</th>
            <th scope="col">Price</th>
            <th scope="col">Price Change</th>
            <th scope="col">Price Change %</th>
            <th scope="col">Volume(24h)</th>
            <th scope="col">High Price</th>
            <th scope="col">Low Price</th>
          </tr>
        </thead>
        <tbody>
          {coins.length > 0
            ? coins.slice((page - 1) * pages, page * pages).map((e, index) => {
                return e !== undefined && e !== null ? (
                  <Coin key={e} symbol={e} index={(page - 1) * pages + index} />
                ) : null;
              })
            : Array.from({ length: 15 }).map((_, index) => (
                <tr key={index} className="text-right table-row">
                  {Array.from({ length: 2 }).map((_, i) => (
                  <th scope="row" className="w-[2%]">
                    <div className="h-5 bg-[#333] rounded my-2.5 animate-pulse"></div>
                  </th>
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <td key={i} className="w-[10%]">
                      <div className="h-5 bg-[#333] rounded my-2.5 animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {coins.length > 0 ? (
        <div className="pagination flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500 w-[33%]">
              Showing <span className="font-bold">{page}</span> of <span className="font-bold">{Math.ceil(coins.length / pages)}</span> pages
            </p>
          <div className="flex items-center gap-2 justify-center w-[33%]">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
            >
              <ChevronLeft/>
            </button>

            <span className="text-white block px-4 py-1 rounded-md bg-[rgba(138,133,232,0.5)] text-base">{page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * pages >= coins.length}
              className="px-2 py-1 border border-gray-500 rounded text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight/>
            </button>
          </div>

            <div className="pages w-[33%] flex items-center justify-end gap-2">
                <select name="pages" className="bg-black border border-gray-500 rounded text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer" id="" value={pages} onChange={(e) => setPages(parseInt(e.target.value))}>
                    {[20, 50, 100, 200].map((_, index) => (
                        <option key={index} value={_} className={`px-3 rounded-sm py-1 bg-black border border-gray-500 text-sm hover:bg-[rgba(138,133,232,0.2)] transition cursor-pointer ${pages === _ ? "bg-[rgba(138,133,232,0.5)] text-[#8884d8]" : ""}`}>
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

export default Dashboard;
