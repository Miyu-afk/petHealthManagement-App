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
  memo: string | null;
  owner_id: string;
  pet_id: number;
}
interface petDataItem {
  pet_id: number;
  date: string | null;
  memo: string | null;
  mood: boolean | null;
  poop: boolean | null;
  meal: boolean | null;
}

interface HealthGraphProps {
  dates: string[];
  healthValueData: number[];
  petIdData: number[];
  setCurrentWeek: Dispatch<SetStateAction<Date>>;
  currentWeek: Date;
  targetPets: Pet | null;
  petDataItem: petDataItem[];
}

function HealthGraph({
  dates,
  healthValueData,
  petIdData,
  setCurrentWeek,
  currentWeek,
  targetPets,
  petDataItem,
}: HealthGraphProps) {
  const allData = dates.map((date, i) => {
    const currentPetId = petIdData[i];
    const theDayDateItems = petDataItem.find((m) => {
      if (!m.date) return;
      const mDate = new Date();
      const d = new Date(date);
      return (
        m.pet_id === currentPetId &&
        mDate.getFullYear() === d.getFullYear() &&
        mDate.getMonth() === d.getMonth() &&
        mDate.getDate() === d.getDate()
      );
    });
    return {
      date,
      health: healthValueData[i],
      id: petIdData[i],
      memo: theDayDateItems ? theDayDateItems.memo : "",
    };
  });

  const petData = targetPets
    ? allData.filter((item) => item.id === targetPets.pet_id)
    : [];

  const weekStart = new Date(currentWeek);
  weekStart.setDate(currentWeek.getDate() - 7);

  const weekData = petData.filter((item) => {
    const recordDate = new Date(item.date.replace(" ", "T"));
    return recordDate >= weekStart && recordDate <= currentWeek;
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
        date.setHours(date.getHours() + 9);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}月${day}日`;
      }),
    datasets: [
      {
        label: "けんこう度",
        data: weekData.map((item) => item.health),
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options = {
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0 && targetPets) {
        const index = elements[0].index;
        const labelDate = graphData.labels[index];
        const labelPetData = graphData.datasets[0].data[index];
        const dateString = labelDate.replace("月", "-").replace("日", "");
        const thisYear = new Date().getFullYear();
        const formattedDate = `${thisYear}-${dateString.padStart(5, "0")}`;

        const theDayDateItem = petDataItem.find((m) => {
          if (!m.date) return false;
          const memoDate = new Date(m.date);
          const targetDate = new Date(formattedDate);

          return (
            memoDate.getFullYear() === targetDate.getFullYear() &&
            memoDate.getMonth() === targetDate.getMonth() &&
            memoDate.getDate() === targetDate.getDate()
          );
        });

        const toMark = (v: boolean | null | undefined) =>
          v === true ? "〇" : v === false ? "×" : " - ";
        const poopMark = toMark(theDayDateItem?.poop);
        const mealMark = toMark(theDayDateItem?.meal);
        const moodMark = toMark(theDayDateItem?.mood);
        const memoText = theDayDateItem?.memo ?? "";

        if (targetPets) {
          alert(
            `【${targetPets.name}ちゃん】\n 日付:${labelDate} \n けんこう度:${labelPetData} \n \n ■日々の記録: \n きげん:${moodMark} トイレ:${poopMark} ごはん:${mealMark} \n \n ■メモ: \n ${memoText}`
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
        <Line
          data={
            targetPets
              ? graphData
              : {
                  labels: [],
                  datasets: [
                    {
                      label: "けんこう度",
                      data: [],
                      borderColor: "rgb(75, 192, 192",
                    },
                  ],
                }
          }
          options={options}
          id="chart-key"
        />
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
