import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Coin = ({ symbol, index }) => {
  let e = useSelector((state) => state.data[symbol]);
  if (!e) return null;
  let priceRef = React.useRef(null);
  const getAmount = (amount) => {
    return Number(amount)
    .toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const [flash, setFlash] = React.useState("");
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
    <tr
      
      style={{ textAlign: "right", display: "table-row" }}
      key={symbol}
    >
      <th scope="row" style={{ width: "2%" }}>
        {index + 1}
      </th>
      <td style={{ width: "10%" }}>{e.symbol}</td>
      <td className={
        flash === "green" ? "greenFlash" : flash === "red" ? "redFlash" : ""
      } style={{ width: "10%" }}>
        $ {getAmount(e.lastPrice) + "."}
        <span style={{ color: "gray", fontSize: "14px" }}>
          {String(Number(e.lastPrice).toFixed(2)).split(".")[1]}
        </span>
      </td>
      <td
        style={{ width: "10%" }}
        className={
          e.priceChange > 0 ? "green" : e.priceChange < 0 ? "red" : "white"
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "5px",
          }}
        >
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
        className={
          e.priceChangePercent > 0
            ? "green"
            : e.priceChangePercent < 0
              ? "red"
              : "white"
        }
        style={{
          width: "10%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "5px",
          }}
        >
          {e.priceChangePercent < 0 ? (
            <ChevronDown />
          ) : e.priceChangePercent > 0 ? (
            <ChevronUp />
          ) : null}{" "}
          {` ${Number(String(e.priceChangePercent).replace("-", "")).toFixed(2)}`}
          {" %"}
        </div>
      </td>
      <td style={{ width: "10%" }}>
        $ {getAmount(e.quoteVolume) + "."}
        <span style={{ color: "gray", fontSize: "14px" }}>
          {String(Number(e.quoteVolume).toFixed(2)).split(".")[1]}
        </span>
      </td>
      <td style={{ width: "10%" }}>
        ${getAmount(e.highPrice) + "."}
        <span style={{ color: "gray", fontSize: "14px" }}>
          {String(Number(e.highPrice).toFixed(2)).split(".")[1]}
        </span>
      </td>
      <td style={{ width: "10%" }}>
        ${getAmount(e.lowPrice) + "."}
        <span style={{ color: "gray", fontSize: "14px" }}>
          {String(Number(e.lowPrice).toFixed(2)).split(".")[1]}
        </span>{" "}
      </td>
    </tr>
  );
};

export default Coin;
