import React, { useEffect, useRef, useState } from "react";
import { fillData, updateCoins } from "../redux/slices/dataSlice";
import { addCoin } from "../redux/slices/coinSlice";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, AreaChart, Area } from "recharts";
import Coin from "./Coin";

const CoinTracker = () => {
  let [tempVar, setTempVar] = useState([]);
  const dispatch = useDispatch();
  const chartApi = "CG-jS1m5sFeRsmPbA2RRnjY2qmH";
  const dataState = useSelector((state) => state.data);
  const coins = useSelector((state) => state.coin);
  const [activeTab, setActiveTab] = useState("Home");
  const options = { method: "GET", headers: { "x-cg-demo-api-key": chartApi } };
  const [page, setPage] = useState(1);

  const initialData = async () => {
    try {
      let response = await fetch(`https://api.binance.com/api/v3/ticker/24hr`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch coin data");
      }
      let jsonData = await response.json();
      let finalData = jsonData.filter((e) => e.symbol.endsWith("USDT"));
      dispatch(addCoin(finalData.map((e) => e.symbol)));
      dispatch(fillData(arrToObj(finalData)));
    } catch (err) {
      console.log(err.message);
    }
  };

  const bufferRef = useRef({});

  const arrToObj = (arr) => {
    let obj = {};
    arr.forEach((e) => {
      obj[e.symbol] = e;
    });
    return obj;
  };

  useEffect(() => {
    initialData();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/!miniTicker@arr",
    );

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (ev) => {
      let data = JSON.parse(ev.data);

      data.forEach((coin) => {
        bufferRef.current[coin.s] = coin;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = Object.values(bufferRef.current);

      if (updates.length) {
        dispatch(updateCoins(updates));
      }

      bufferRef.current = {};
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "36px", color: "#5952ee" }}>
        Crypto<span style={{ color: "gray" }}>Buddy</span>
      </h1>
      <div className="container">
        <div
          className="tabs"
          style={{
            display: "flex",
            position: "sticky",
            top: "0",
            gap: "20px",
            backgroundColor: "black",
            width: "100%",
            zIndex: "100",
            marginBottom: "20px",
            borderBottom: "1px solid #444",
          }}
        >
          {["Home", "Watchlist", "LeaderBoard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 15px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #8884d8" : "none",
                color: activeTab === tab ? "#8884d8" : "inherit",
                cursor: "pointer",
                fontWeight: activeTab === tab ? "bold" : "normal",
                fontSize: "16px",
                transition: "0.3s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Home" && (
          <div>
          <table>
            <thead
              style={{
                backgroundColor: "#222",
                color: "#fff",
                position: "sticky",
                top: "42px",
              }}
            >
              <tr style={{ textAlign: "right" }}>
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
              {coins.length > 0 ? (
                coins.slice((page - 1) * 10, page * 10).map((e, index) => {
                  return e !== undefined && e !== null ? (
                    <Coin symbol={e} index={(page - 1) * 10 + index} />
                  ) : null;
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <p>Loading...</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div
        className="pagination"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{
            padding: "5px 15px",
            background: "transparent",
            border: "1px solid #444",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
            borderRadius: "5px",
          }}
        >
          Previous
        </button>

        <span style={{ color: "#8884d8", fontSize: "16px" }}>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page * 10 >= coins.length}
          style={{
            padding: "5px 15px",
            background: "transparent",
            border: "1px solid #444",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
            borderRadius: "5px",
          }}
        >
          Next
        </button>
      </div>
          </div>
        )}

        {activeTab === "Watchlist" && (
          <div
            className="watchlist-content"
            style={{ padding: "20px", textAlign: "center" }}
          >
            <h2>Your Watchlist</h2>
            <p>Currencies you add to your watchlist will appear here.</p>
          </div>
        )}

        {activeTab === "LeaderBoard" && (
          <div
            className="leaderboard-content"
            style={{ padding: "20px", textAlign: "center" }}
          >
            <h2>LeaderBoard</h2>
            <p>Top performing cryptocurrencies based on volume and trends.</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default CoinTracker;
