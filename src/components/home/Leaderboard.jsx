import React from "react";
import { useReactTable } from '@tanstack/react-table'
import { useSelector } from "react-redux";
const Leaderboard = () => {
    let data = useSelector((state) => state.data);
    let coins = useSelector((state) => state.coin);
  return (
    <div className="leaderboard-content p-4 text-center">
      {/*Top Gainers*/}
        <h2>Not Yet Implemented</h2>
    </div>
  );
};

export default Leaderboard;
