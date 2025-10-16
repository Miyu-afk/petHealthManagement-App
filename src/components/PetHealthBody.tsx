import SmileIcon from "./SmileIcon";
import SmileIconOn from "./SmileIconOn";
import FrownIcon from "./FrownIcon";
import FrownIconOn from "./FrownIconOn";
import HealthGraph from "./HealthGraph";
import GoodButton from "./GoodButton";
import GoodButtonOn from "./GoodButtonOn";
import BadButton from "./BadButton";
import BadButtonOn from "./BadButtonOn";
import React, { useEffect, useState } from "react";
import ToggleButton from "./ToggleButton";
import CheckButton from "./CheckButton";
import NoCheckButton from "./NoCheckButton";
import SelectPet from "./SelectPet";
import Memo from "./Memo";

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

interface PetHealthBodyProps {
  SuccessModalOpen: () => void;
  addHealth: (data: Partial<Pet>) => void;
  petsData: Pet[] | null;
  onChildSelectedPet: (pet: Pet) => void;
  onChildAddPet: (newPetData: Partial<Pet>) => void;
  newPet: Pet | null;
}

const PetHealthBody = ({
  SuccessModalOpen,
  addHealth,
  petsData,
  onChildSelectedPet,
  onChildAddPet,
  newPet,
}: PetHealthBodyProps) => {
  if (!petsData) {
    return (
      <div className="flex justify-center mt-20">...データ読み込み中...</div>
    );
  }

  useEffect(() => {
    if (newPet) {
      setTargetPets(newPet);
      onChildSelectedPet(newPet);
    }
  }, [newPet]);

  const [smileOn, setSmileOn] = useState(false);
  const [frownOn, setFrownOn] = useState(false);
  const [poopGoodOn, setPoopGoodOn] = useState(false);
  const [poopBadOn, setPoopBadOn] = useState(false);
  const [mealBadOn, setMealBadOn] = useState(false);
  const [mealGoodOn, setMealGoodOn] = useState(false);
  const [healthValue, setHealthValue] = useState(50);
  const [memoData, setMemoData] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [targetPets, setTargetPets] = useState<Pet | null>();

  const handlePetSelected = (SelectedPet: Pet) => {
    setTargetPets(SelectedPet);
    onChildSelectedPet(SelectedPet);
  };

  const sortedPets = petsData.sort((a, b) => {
    const dateA = a.record ? new Date(a.record).getTime() : 0;
    const dateB = b.record ? new Date(b.record).getTime() : 0;
    return dateA - dateB;
  });
  const dates = sortedPets
    .map((item) => item.record)
    .filter((record): record is string => record !== null);
  const petIdData = sortedPets.map((item) => item.id);
  const vitalityData = sortedPets
    .map((item) => item.vitality)
    .filter((v): v is number => v !== null);

  const healthObj = [
    {
      name: "きげん",
      tags: () => {
        return (
          <>
            <ToggleButton
              isOn={smileOn}
              onToggle={() => setSmileOn((prev) => !prev)}
              onIcon={<SmileIconOn />}
              offIcon={<SmileIcon />}
              onOrOff={frownOn}
            />

            <ToggleButton
              isOn={frownOn}
              onToggle={() => setFrownOn((prev) => !prev)}
              onIcon={<FrownIconOn />}
              offIcon={<FrownIcon />}
              onOrOff={smileOn}
            />
          </>
        );
      },
    },
    {
      name: "トイレ",
      tags: () => {
        return (
          <>
            <ToggleButton
              isOn={poopGoodOn}
              onToggle={() => {
                setPoopGoodOn((prev) => !prev);
              }}
              onIcon={<GoodButtonOn />}
              offIcon={<GoodButton />}
              onOrOff={poopBadOn}
            />

            <ToggleButton
              isOn={poopBadOn}
              onToggle={() => setPoopBadOn((prev) => !prev)}
              onIcon={<BadButtonOn />}
              offIcon={<BadButton />}
              onOrOff={poopGoodOn}
            />
          </>
        );
      },
    },
    {
      name: "ごはん",
      tags: () => {
        return (
          <>
            <ToggleButton
              isOn={mealGoodOn}
              onToggle={() => setMealGoodOn((prev) => !prev)}
              onIcon={<GoodButtonOn />}
              offIcon={<GoodButton />}
              onOrOff={mealBadOn}
            />

            <ToggleButton
              isOn={mealBadOn}
              onToggle={() => {
                setMealBadOn((prev) => !prev);
              }}
              onIcon={<BadButtonOn />}
              offIcon={<BadButton />}
              onOrOff={mealGoodOn}
            />
          </>
        );
      },
    },
    {
      name: "けんこう",
      tags: () => {
        return (
          <>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={healthValue}
              className="mt-2px w-[100px]"
              onChange={(e) => {
                setHealthValue(Number(e.target.value));
              }}
            ></input>
            <span className="span-element text-l pl-2">{healthValue}</span>
          </>
        );
      },
    },
  ];
  const allClean = () => {
    setSmileOn(false);
    setFrownOn(false);
    setPoopGoodOn(false);
    setPoopBadOn(false);
    setMealGoodOn(false);
    setMealBadOn(false);
    setHealthValue(50);
    setMemoData("");
  };

  return (
    <>
      <div className="flex justify-center mt-18 text-2xl">
        <SelectPet
          key={petsData?.length}
          petsData={petsData}
          onPetSelect={handlePetSelected}
          addPet={onChildAddPet}
        />
      </div>

      <div className="flex justify-center mt-5 text-l">
        <p>おなまえ：{targetPets ? targetPets.name : "???"}ちゃん</p>
      </div>
      <div className="grid grid-cols-2 mt-10">
        {healthObj.map((obj) => (
          <>
            <div className="flex text-right mr-4 items-center justify-end">
              <span className="text-l">{obj.name}</span>
            </div>
            <div className="flex items-center">{obj.tags()}</div>
          </>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <Memo
          onChange={(e) => {
            const textValue = e.target.value;
            setMemoData(textValue);
          }}
        />
      </div>

      <div className="flex justify-center mt-8">
        <CheckButton
          onClick={() => {
            const hasInput =
              smileOn ||
              frownOn ||
              poopGoodOn ||
              poopBadOn ||
              mealGoodOn ||
              mealBadOn ||
              healthValue !== 50 ||
              memoData.trim() !== "";

            if (!hasInput) {
              alert("入力してください");
              return;
            }

            if (!targetPets) {
              alert("ペットを選んでください");
              return;
            }

            const dataToSave: Partial<Pet> = {
              name: targetPets.name,
              vitality: healthValue,
              record: new Date().toISOString().split("T")[0],
              owner_id: targetPets.owner_id,
              pet_id: targetPets.pet_id,
              ...(memoData.trim() && { memo: memoData }),
            };

            if (smileOn) dataToSave.mood = true;
            else if (frownOn) dataToSave.mood = false;

            if (poopGoodOn) dataToSave.poop = true;
            else if (poopBadOn) dataToSave.poop = false;

            if (mealGoodOn) dataToSave.meal = true;
            else if (mealBadOn) dataToSave.meal = false;

            addHealth(dataToSave);
            allClean();
            SuccessModalOpen();
          }}
        />
        <NoCheckButton
          onClick={() => {
            allClean();
          }}
        />
      </div>

      <div className="mt-10">
        <HealthGraph
          dates={dates}
          healthValueData={vitalityData}
          petIdData={petIdData}
          petsData={petsData}
          targetPets={targetPets ?? null}
          setCurrentWeek={setCurrentWeek}
          currentWeek={currentWeek}
        />
      </div>
    </>
  );
};

export default PetHealthBody;
