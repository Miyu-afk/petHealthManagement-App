import React, { Dispatch, SetStateAction, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
} from "chart.js";
import { ActiveElement } from "chart.js/dist/plugins/plugin.tooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Pet {
  id: number;
  name: string;
  mood: boolean | null;
  poop: boolean | null;
  meal: boolean | null;
  vitality: number | null;
  record: string | null;
  owner_id: number;
  pet_id: number;
}

interface HealthGraphProps {
  petsData: Pet[] | null;
  dates: string[];
  healthValueData: number[];
  catNameData: string[];
  setCurrentWeek: Dispatch<SetStateAction<Date>>;
  currentWeek: Date;
  targetPets: Pet | null;
}

function HealthGraph({
  dates,
  healthValueData,
  catNameData,
  setCurrentWeek,
  currentWeek,
  targetPets,
}: HealthGraphProps) {
  const allDate = dates.map((date, i) => ({
    date,
    health: healthValueData[i],
    name: catNameData[i],
  }));
  const petData = allDate.filter((item) => {
    return item.name.includes(`${name}`);
  });
  const graphData = {
    labels: petData
      .filter((item) => {
        const recordDate = new Date(item.date.split(" ")[0]);
        const weekStart = new Date(currentWeek);
        weekStart.setDate(currentWeek.getDate() - 7);
        return recordDate >= weekStart && recordDate <= currentWeek;
      })
      .map((item) => {
        const date = new Date(item.date);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}月${day}日`;
      }),
    datasets: [
      {
        label: "けんこう度",
        data: petData.map((item) => item.health),
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options = {
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const LabelDate = graphData.labels[index];
        const LabelCatData = graphData.datasets[0].data[index];
        if (targetPets) {
          alert(
            `${targetPets.name}ちゃん、${LabelDate} けんこう度=${LabelCatData}`
          );
        }
      }
    },
    scales: {
      y: {
        max: 100,
        min: 20,
        ticks: {
          stepSize: 20,
        },
      },
      x: {},
    },
    maintainAspectRatio: false,
  };

  const divStyle: React.CSSProperties = {
    margin: "10px auto",
    width: "70%",
    height: "70%",
  };

  return (
    <>
      <div className="App" style={divStyle}>
        <Line data={graphData} options={options} id="chart-key" />
      </div>
      <div className="flex justify-between ml-10 mr-10">
        <button
          className="text-sm"
          onClick={() => {
            const prevWeek = new Date(currentWeek);
            prevWeek.setDate(currentWeek.getDate() - 7);
            setCurrentWeek(prevWeek);
          }}
        >
          前へ
        </button>
        <button
          className="text-sm"
          onClick={() => {
            const nextWeek = new Date(currentWeek);
            nextWeek.setDate(currentWeek.getDate() + 7);
            setCurrentWeek(nextWeek);
          }}
        >
          次へ
        </button>
      </div>
    </>
  );
}

export default HealthGraph;
