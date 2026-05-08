import { ChevronDown, ChevronUp, Star } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../redux/slices/watchlistSlice";
import Toast from "./miscellaneous/Toast";
import { displayToast } from "../redux/slices/toastSlice";

const Coin = ({ symbol, index }) => {
  let e = useSelector((state) => state.data[symbol]);
  let watchlist = useSelector((state) => state.watchlist);
  let dispatch = useDispatch();
  if (!e) return null;
  let priceRef = React.useRef(null);
  const getAmount = (amount) => {
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const [flash, setFlash] = React.useState("");
  const isWatchlisted = watchlist.includes(symbol);

  const handleWatchlistToggle = (event) => {
    event.stopPropagation();
    if (isWatchlisted) {
      dispatch(removeFromWatchlist(symbol));
      dispatch(displayToast(`${symbol} removed from watchlist`));
    } else {
      dispatch(addToWatchlist(symbol));
      dispatch(displayToast(`${symbol} added to watchlist`));
    }
  };

  useEffect(() => {
    if (priceRef.current !== null) {
      if (Number(e.lastPrice) > Number(priceRef.current)) {
        setFlash("");
        setTimeout(() => {
          setFlash("green");
        }, 0);
      } else if (Number(e.lastPrice) < Number(priceRef.current)) {
        setFlash("");

        setTimeout(() => {
          setFlash("red");
        }, 0);
      }
    }

    priceRef.current = e.lastPrice;
  }, [e.lastPrice]);
  return (
    <>
      <tr className="text-right table-row select-none" key={symbol}>
        <th
          scope="row"
          className={`w-[2%] ${isWatchlisted ? "text-yellow-400" : "text-gray-500"} cursor-pointer`}
        >
          <div title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"} onClick={handleWatchlistToggle}>
            <Star />
          </div>
        </th>
        <th scope="row" className="w-[2%]">
          {index + 1}
        </th>
        <td className="w-[10%]"><div className="font-bold text-lg">{e?.name}</div><div className="text-gray-500 text-sm">{e.symbol}</div></td>
        <td
          className={`w-[10%] ${flash === "green" ? "greenFlash" : flash === "red" ? "redFlash" : ""}`}
        >
          $ {getAmount(e.lastPrice) + "."}
          <span className="text-gray-500 text-sm">
            {String(Number(e.lastPrice).toFixed(2)).split(".")[1]}
          </span>
        </td>
        <td
          className={`w-[10%] ${
            e.priceChange > 0 ? "green" : e.priceChange < 0 ? "red" : "white"
          }`}
        >
          <div className="flex items-center justify-end gap-[5px]">
            {" "}
            {e.priceChange < 0 ? (
              <ChevronDown />
            ) : e.priceChange > 0 ? (
              <ChevronUp />
            ) : null}
            {` ${String(Number(e.priceChange).toFixed(2)).replace("-", "")}`}
          </div>
        </td>
        <td
          className={`w-[10%] ${
            e.priceChangePercent > 0
              ? "green"
              : e.priceChangePercent < 0
                ? "red"
                : "white"
          }`}
        >
          <div className="flex items-center justify-end gap-[5px]">
            {e.priceChangePercent < 0 ? (
              <ChevronDown />
            ) : e.priceChangePercent > 0 ? (
              <ChevronUp />
            ) : null}{" "}
            {` ${Number(String(e.priceChangePercent).replace("-", "")).toFixed(2)}`}
            {" %"}
          </div>
        </td>
        <td className="w-[10%]">
          $ {getAmount(e.quoteVolume) + "."}
          <span className="text-gray-500 text-sm">
            {String(Number(e.quoteVolume).toFixed(2)).split(".")[1]}
          </span>
        </td>
        <td className="w-[10%]">
          ${getAmount(e.highPrice) + "."}
          <span className="text-gray-500 text-sm">
            {String(Number(e.highPrice).toFixed(2)).split(".")[1]}
          </span>
        </td>
        <td className="w-[10%]">
          ${getAmount(e.lowPrice) + "."}
          <span className="text-gray-500 text-sm">
            {String(Number(e.lowPrice).toFixed(2)).split(".")[1]}
          </span>{" "}
        </td>
      </tr>
    </>
  );
};

export default Coin;
