import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState("");

  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8000/market-data")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getPrediction = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        null,
        {
          params: {
            close: 61000,
            volume: 30000000000,
            sma_7: 60500,
            sma_30: 59000,
            returns: 0.01,
            volatility: 0.02,
          },
        }
      );

      setPrediction(res.data.prediction);
    } catch (err) {
      console.log(err);
    }
  };

  const latest = data.length > 0 ? data[0] : null;

  return (
    <div className="app">

      <div className="header">
        <h1>🚀 AlphaForge</h1>
        <p>AI Powered Bitcoin Intelligence Dashboard</p>
      </div>

      {latest && (
        <div className="kpi-grid">

          <div className="card">
            <h4>BTC Price</h4>
            <h2>${latest.close_price.toFixed(2)}</h2>
          </div>

          <div className="card">
            <h4>24H High</h4>
            <h2>${latest.high_price.toFixed(2)}</h2>
          </div>

          <div className="card">
            <h4>24H Low</h4>
            <h2>${latest.low_price.toFixed(2)}</h2>
          </div>

          <div className="card">
            <h4>Volume</h4>
            <h2>
              {(latest.volume / 1000000000).toFixed(2)}B
            </h2>
          </div>

        </div>
      )}

      <div className="button-section">
        <button
          className="predict-btn"
          onClick={getPrediction}
        >
          Predict Market
        </button>
      </div>

      {prediction && (
        <div
          className={
            prediction === "UP"
              ? "prediction-up"
              : "prediction-down"
          }
        >
          <h2>Prediction: {prediction}</h2>

          <p>
            {prediction === "UP"
              ? "🟢 BUY SIGNAL"
              : "🔴 SELL SIGNAL"}
          </p>
        </div>
      )}

      <div className="chart-card">

        <h2>📈 BTC Price Trend</h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart
            data={[...data].reverse()}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="id" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="close_price"
              stroke="#00D09C"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      <div className="table-card">

        <h2>📋 Market History</h2>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Close</th>
              <th>Volume</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  $
                  {item.close_price.toFixed(
                    2
                  )}
                </td>

                <td>
                  {(
                    item.volume /
                    1000000000
                  ).toFixed(2)}
                  B
                </td>

                <td>
                  {new Date(
                    item.timestamp
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;