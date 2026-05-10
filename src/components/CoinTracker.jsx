import React, { useEffect, useRef, useState } from "react";
import { fillData, updateCoins } from "../redux/slices/dataSlice";
import { addCoin } from "../redux/slices/coinSlice";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, AreaChart, Area } from "recharts";
import Coin from "./Coin";
import Watchlist from "./home/Watchlist";
import Leaderboard from "./home/Leaderboard";
import Dashboard from "./home/Dashboard";
import Toast from "./miscellaneous/Toast";
import { setNames } from "../redux/slices/nameSlice";
import useDebounce from "../hooks/useDebounce";
import { setSearchList } from "../redux/slices/searchSlice";

const CoinTracker = () => {
  const dispatch = useDispatch();
  const chartApi = "CG-jS1m5sFeRsmPbA2RRnjY2qmH";
  const dataState = useSelector((state) => state.data);
  const [activeTab, setActiveTab] = useState("Home");
  const options = { method: "GET", headers: { "x-cg-demo-api-key": chartApi } };
  const names = useSelector((state) => state.names);
  const [term , setTerm] = useState("");
  let debouncedSearchTerm = useDebounce(term, 500);

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
      let dataWithNames = nameAdder(arrToObj(finalData));
      dispatch(fillData(dataWithNames));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchNames = async () => {
    try {
      let [r1, r2, r3] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1`,
          options,
        ),
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=2`,
          options,
        ),
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=3`,
          options,
        ),
      ]);
      let [d1, d2, d3] = await Promise.all([r1.json(), r2.json(), r3.json()]);
      let allNames = [...d1, ...d2, ...d3];
      dispatch(setNames(allNames));
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  const nameAdder = (obj) => {
    let newObj = { ...obj };
    let coins = Object.keys(obj);

    let nameMap = {};
    names.forEach((e) => {
      nameMap[e.symbol.toLowerCase()] = e.name;
    });

    coins.forEach((coin) => {
      let abbv = coin.replace("USDT", "").toLowerCase();

      newObj[coin] = {
        ...newObj[coin],
        name: nameMap[abbv] || abbv.toUpperCase(),
      };
    });

    return newObj;
  };

  const bufferRef = useRef({});

  const arrToObj = (arr) => {
    let obj = {};
    arr.forEach((e) => {
      obj[e.symbol] = e;
    });
    return obj;
  };

  const searchCoins = (searchTerm) => {
    let coindata = Object.values(dataState);
    let searchResults = coindata.filter(coin => coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || coin.name.toLowerCase().includes(searchTerm.toLowerCase())).map(e => e.symbol);
    dispatch(setSearchList(searchResults));
  }

  useEffect(()=>{
    if(debouncedSearchTerm){
      searchCoins(debouncedSearchTerm)
    }else{
      dispatch(setSearchList([]));
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchNames();
  }, []);
  useEffect(() => {
    initialData();
  }, [names]);

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
    <div className="p-5">
      <h1 className="text-4xl font-bold py-5 text-[#5952ee]">
        Crypto<span className="text-gray-500">Buddy</span>
      </h1>
      <div className="container">
        <div className="tabs flex sticky top-0 gap-5 bg-black w-full z-[100] mb-5 border-b border-[#444]">
          {["Home", "Watchlist", "LeaderBoard"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2.5 bg-transparent cursor-pointer text-base transition-all duration-300 ${
                activeTab === tab
                  ? "border-b-2 border-[#8884d8] text-[#8884d8] font-bold"
                  : "font-normal border-b-2 border-transparent hover:border-[#8884d8] hover:text-[#8884d8]"
              }`}
            >
              {tab}
            </button>
          ))}
         {activeTab === "Home" && <div className="w-full self-center justify-end flex"><input type="text" className="rounded py-1 px-2 bg-black border border-gray-500 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8884d8]" placeholder="Search coins..." value={term} onChange={(e)=> setTerm(e.target.value)} /></div>}
         
        </div>

        {activeTab === "Home" && <Dashboard />}

        {activeTab === "Watchlist" && <Watchlist />}

        {activeTab === "LeaderBoard" && <Leaderboard />}
      </div>
      <Toast />
    </div>
  );
};

export default CoinTracker;
