import { ChartData, ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import Barchart from "../components/Dashboard/Barchart";
import Doughnut from "../components/Dashboard/Doughnut";
import Linechart from "../components/Dashboard/Linechart";
import "chartjs-adapter-date-fns";

type dashboardData = {
  averageHolding: number;
  dailyPriceDates: priceDate[];
  monthlyPriceDates: priceDate[];
  netDeposits: number;
  numInvestors: number;
  profits: object;
};

type priceDate = {
  date: string;
  price: number;
};

function Dashboard() {
  const [qitData, setQitData] = useState<dashboardData>();
  const [chartDate, setChartDate] = useState(7);
  const [lineData, setLineData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const [barData, setBarData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  async function getQitData() {
    try {
      const res = await fetch(`https://rgtestnet.pythonanywhere.com/api/v1/qit`, {});
      const data = await res.json();
      // console.log(data);
      setQitData(data);
      console.log(qitData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getQitData();
  }, []);

  useEffect(() => {
    if (!qitData) {
      console.log("No dashboard data");
      return;
    }
    // Line chart
    setLineData({
      labels: qitData?.dailyPriceDates.map((item) => item.date).slice(-chartDate),
      datasets: [
        {
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(235,237,255,1)");
            gradient.addColorStop(1, "rgba(235,237,255,0)");
            return gradient;
          },
          label: "UST",
          fill: "start",
          borderColor: "#8E95DF",
          data: qitData.dailyPriceDates.map((item) => item.price).slice(-chartDate),
        },
      ],
    });

    // Barchart
    setBarData({
      labels: qitData?.monthlyPriceDates.map((item) => item.date),
      datasets: [
        {
          label: "Price of QIT",
          data: qitData?.monthlyPriceDates.map((i) => i.price),
          backgroundColor: [
            "rgba(220, 218, 251)",
            "rgba(253, 147, 128)",
            "rgba(220, 218, 251)",
            "rgba(253, 147, 128)",
            "rgba(220, 218, 251)",
            "rgba(253, 147, 128)",
            "rgba(220, 218, 251)",
            "rgba(253, 147, 128)",
            "rgba(220, 218, 251)",
            "rgba(253, 147, 128)",
            "rgba(220, 218, 251)",
            "rgba(253, 147, 128)",
          ],
          borderWidth: 1,
        },
      ],
    });
    console.log(barData);
  }, [qitData, chartDate]);

  const config: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Price of QIT",
      },
    },
  };
  const dailyPriceConfig: ChartOptions<"line"> = {
    responsive: true,
    elements: {
      line: {
        tension: 0.2,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      filler: {},
    },
  };

  return (
    <>
      <div className="flex justify-center py-4 text-black">
        <div className="grid self-center min-h-screen grid-cols-2 gap-4 p-4 text-black min-w-fit max-w-7xl">
          <div className="col-span-2 bg-white rounded-lg dark:bg-slate-100 sm:col-span-1">
            <Doughnut></Doughnut>
          </div>
          <div className="col-span-2 p-3 bg-white rounded-lg dark:bg-slate-100 sm:col-span-1">
            {barData.datasets[0].data.length !== 0 ? (
              <Barchart data={barData} config={config}></Barchart>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <svg
                  className="inline w-4 h-4 mr-1 -ml-1 text-black animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="inline-block">Loading chart data...</p>
              </div>
            )}
          </div>
          <div className="col-span-2 p-3 bg-white rounded-lg dark:bg-slate-100">
            <div>
              <button
                onClick={() => {
                  setChartDate(7);
                }}
                className={`rounded-md px-2 ${chartDate === 7 ? "border border-black" : ""}`}
              >
                Week
              </button>
              <button
                onClick={() => {
                  setChartDate(30);
                }}
                className={`rounded-md px-2 ${chartDate === 30 ? "border border-black" : ""}`}
              >
                Month
              </button>
              <button
                onClick={() => {
                  setChartDate(180);
                }}
                className={`rounded-md px-2 ${chartDate === 180 ? "border border-black" : ""}`}
              >
                3 Months
              </button>
              <button
                onClick={() => {
                  setChartDate(365);
                }}
                className={`rounded-md px-2 ${chartDate === 365 ? "border border-black" : ""}`}
              >
                Year
              </button>
              <button
                onClick={() => {
                  setChartDate(0);
                }}
                className={`rounded-md px-2 ${chartDate === 0 ? "border border-black" : ""}`}
              >
                Lifetime
              </button>
            </div>

            {lineData.datasets[0].data.length !== 0 ? (
              <Linechart title="Daily Prices" data={lineData} config={dailyPriceConfig}></Linechart>
            ) : (
              <div className="flex items-center justify-center w-full h-full py-4">
                <svg
                  className="inline w-4 h-4 mr-1 -ml-1 text-black animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="inline-block">Loading chart data...</p>
              </div>
            )}
          </div>

          {/* Nr of investors */}
          <div className="flex flex-col items-center justify-center w-full col-span-1 px-4 py-5 overflow-hidden text-center bg-white rounded-lg shadow dark:bg-slate-100 sm:flex sm:flex-col sm:p-6">
            <dt className="text-sm font-medium text-gray-500 text-clip">{"Number of Investors"}</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {qitData?.numInvestors}
            </dd>
          </div>

          {/* Avg investment into fund */}
          <div className="flex flex-col items-center justify-center w-full col-span-1 px-4 py-5 overflow-hidden text-center bg-white rounded-lg shadow dark:bg-slate-100 sm:flex sm:flex-col sm:p-6">
            <dt className="text-sm font-medium text-gray-500 text-clip">
              {"Avg. Investment into Fund"}
            </dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {qitData?.averageHolding}
            </dd>
          </div>

          <div className="col-span-2 p-3 bg-white rounded-lg dark:bg-slate-100">
            {lineData.labels?.length !== 0 ? (
              <Linechart title="Daily Prices" data={lineData} config={dailyPriceConfig}></Linechart>
            ) : (
              <div className="flex items-center justify-center w-full h-full py-4">
                <svg
                  className="inline w-4 h-4 mr-1 -ml-1 text-black animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="inline-block">Loading chart data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
