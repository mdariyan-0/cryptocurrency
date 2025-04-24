import React, { useEffect } from "react";
import { fillData } from "../redux/slices/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, AreaChart, Area} from "recharts";

const CoinTracker = () => {
  const dispatch = useDispatch();
  const chartApi = "CG-jS1m5sFeRsmPbA2RRnjY2qmH";
  const currencies = ["bitcoin", "ethereum", "solana", "dogecoin", "cardano"];
  const dataState = useSelector((state) => state.data);
  const fetchData = async () => {
    try {
      let dataArr = await Promise.all(
        currencies.map(async (e, index) => {
          try {
            let [res1, res2] = await Promise.all([
              fetch(
                `https://api.coingecko.com/api/v3/coins/${e}?x_cg_demo_api_key=${chartApi}`,
                {
                  mode: "cors",
                }
              ),
              fetch(
                `https://api.coingecko.com/api/v3/coins/${e}/market_chart?x_cg_demo_api_key=${chartApi}&vs_currency=usd&days=7`,
                {
                  mode: "cors",
                }
              ),
            ]);
            let [data1, data2] = await Promise.all([res1.json(), res2.json()]);

            return {
              name: `${data1.name}  (${data1.symbol.toUpperCase()})`,
              currentPrice: data1.market_data.current_price.usd.toFixed(2),
              percentChange1h:
                data1.market_data.price_change_percentage_1h_in_currency.usd.toFixed(
                  2
                ),
              percentChange24h:
                data1.market_data.price_change_percentage_24h_in_currency.usd.toFixed(
                  2
                ),
              percentChange7d:
                data1.market_data.price_change_percentage_7d_in_currency.usd.toFixed(
                  2
                ),
              marketCap: data1.market_data.market_cap.usd.toFixed(2),
              volume24h: data1.market_data.total_volume.usd.toFixed(2),
              circulatingSupply:
                data1.market_data.circulating_supply.toFixed(2),
              graphData: data2.prices.map((e, index)=>{
                return {data : Math.ceil(e[1])}
              }),
            };
          } catch (err) {
            console.log(err.message);
          }
        })
      );

      dispatch(fillData(dataArr));
      Array.from(document.getElementsByClassName("flicker")).map((e)=>{
        e.classList.add("flick")

        setTimeout(()=>{
          e.classList.remove("flick")
        },300)
      })
      
    } catch (err) {
      console.log(err.message);
    }
  };
  const getAmount = (amount) =>{
    return Math.ceil(amount).toLocaleString('en-US');
  }
  useEffect(() => {
    fetchData();

    let timer = setInterval(() => {
      fetchData();
    }, 14000); // interval is set to 14 seconds because of api limitations

    return () => clearInterval(timer);
  }, []);
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
              return (<>
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
                  <td className="flicker">{getAmount(e.circulatingSupply)}</td>
                  <td className="graph">
                    {" "}
                    <AreaChart width={160} height={70} data={e.graphData}>
                    <Area type="monotone" dataKey="data" stroke="#8884d8" fill="#8884d8" />
                    <Tooltip/>
                    </AreaChart>
                  </td>
                </tr>
                </>
              );
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
