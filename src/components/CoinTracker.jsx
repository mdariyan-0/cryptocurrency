import React, { useEffect } from "react";
import { fillData } from "../redux/slices/dataSlice";
import { addCurrency } from "../redux/slices/currencySlice";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, AreaChart, Area } from "recharts";

const CoinTracker = () => {
  const dispatch = useDispatch();
  const chartApi = "CG-jS1m5sFeRsmPbA2RRnjY2qmH";
  const dataState = useSelector((state) => state.data);
  const currency = useSelector((state) => state.currency);
  const currencyFetch = async () => {
    try {
      let data = await fetch(
        `https://api.coingecko.com/api/v3/coins/list?x_cg_demo_api_key=${chartApi}`,
        {
          mode: "cors",
        }
      );
      let jsonData = await data.json();
      
      dispatch(addCurrency(jsonData));
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchData = async () => {
    console.log(currency.slice(1000,1015));
    
    try {
      let dataArr = await Promise.all(
        currency.length > 1? currency.slice(1000,1015).map(async (e, index) => {
          
          try {
            
            let [res1, res2] = await Promise.all([
              fetch(
                `https://api.coingecko.com/api/v3/coins/${e?.id || "bitcoin"}?x_cg_demo_api_key=${chartApi}`,
                {
                  mode: "cors",
                }
              ),
              fetch(
                `https://api.coingecko.com/api/v3/coins/${e?.id || "bitcoin"}/market_chart?x_cg_demo_api_key=${chartApi}&vs_currency&days=7`,
                {
                  mode: "cors",
                }
              ),
            ]);
            
            let [data1, data2] = await Promise.all([res1.json(), res2.json()]);
            return data1 && data1.market_data ? {
              name: `${data1.name}  (${data1.symbol.toUpperCase()})`,
              symbol: data1.symbol.toUpperCase(),
              currentPrice: data1.market_data.currentPrice.toFixed(2),
              percentChange1h:
                data1.market_data.percentChange1h.toFixed(
                  2
                ),
              percentChange24h:
                data1.market_data.percentChange24h.toFixed(
                  2
                ),
              percentChange7d:
                data1.market_data.percentChange7d.toFixed(
                  2
                ),
              marketCap: data1.market_data.marketCap.toFixed(2),
              volume24h: data1.market_data.volume24h.toFixed(2),
              circulatingSupply:
                data1.market_data.circulatingSupply.toFixed(2),
              graphData: data2.prices.map((e, index) => {
                return { data: e[1].toFixed(2) };
              }),
            } : null
            
          } catch (err) {
            console.log(err.message);
          }
        }): null
      );
      console.log(dataArr);
      
      dispatch(fillData(dataArr));
      Array.from(document.getElementsByClassName("flicker")).map((e) => {
        e.classList.add("flick");

        setTimeout(() => {
          e.classList.remove("flick");
        }, 300);
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const getAmount = (amount) => {
    return Math.ceil(amount).toLocaleString("en-US");
  };
  useEffect(() => {
    currencyFetch();
  }, []);
  useEffect(() => {
    if (currency.length > 1) {
      fetchData();
      
      let timer = setInterval(() => {
        fetchData();
      }, 14000); // interval is set to 14 seconds because of api limitations

      return () => clearInterval(timer);
    }
  }, [currency]);
  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Prices</th>
            <th scope="col">1h %</th>
            <th scope="col">24hr %</th>
            <th scope="col">7d %</th>
            <th scope="col">Market Cap</th>
            <th scope="col">Volume(24h)</th>
            <th scope="col">Circulating Supply</th>
            <th scope="col">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {dataState != "" ? (
            dataState.map((e, index) => {
              return e?.length> 1? (
                <>
                  <tr className="table-data" key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{e.name}</td>
                    <td className="flicker">$ {e.currentPrice}</td>
                    <td className={e.percentChange1h > 0 ? "green" : "red"}>
                      {e.percentChange1h} %
                    </td>
                    <td className={e.percentChange24h > 0 ? "green" : "red"}>
                      {e.percentChange24h} %
                    </td>
                    <td className={e.percentChange7d > 0 ? "green" : "red"}>
                      {e.percentChange7d} %
                    </td>
                    <td className="flicker">$ {getAmount(e.marketCap)}</td>
                    <td className="flicker">$ {getAmount(e.volume24h)}</td>
                    <td className="flicker">
                      {getAmount(e.circulatingSupply) + e.symbol}{" "}
                    </td>
                    <td className="graph">
                      {" "}
                      <AreaChart width={160} height={70} data={e.graphData}>
                        <Area
                          type="monotone"
                          dataKey="data"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                        <Tooltip />
                      </AreaChart>
                    </td>
                  </tr>
                </>
              ) : null;
            })
          ) : (
            <p>Loading...</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTracker;
