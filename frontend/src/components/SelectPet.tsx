import { useState } from "react";
import CheckButton from "./CheckButton";

interface Pet {
  id: number;
  name: string;
  mood: boolean | null;
  poop: boolean | null;
  meal: boolean | null;
  vitality: number;
  record: string;
  owner_id: number;
  pet_id: number;
}

interface SelectPetsProps {
  petsData: Pet[];
  onPetSelect: (pet: Pet) => void;
}

const SelectPet = ({ petsData, onPetSelect }: SelectPetsProps) => {
  // const cats = catList[1]

  // for(let i = 0; i <= cats.length; i++){
  //   const catsName = cats[i].name;
  // }

  if (!petsData || Object.keys(petsData).length < 2) {
    return null;
  }

  const [selectedPet, setSelectedPet] = useState<number | null>(null);

  const ownersPets = petsData.filter((pet) => pet.owner_id === 1);
  const seen = new Set();
  const uniquePets = ownersPets.filter(
    (pet) => !seen.has(pet.pet_id) && seen.add(pet.pet_id)
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const petId = Number(e.target.value);
    setSelectedPet(petId);
  };

  const handleClickSelect = () => {
    const selected = petsData.find((pet) => pet.pet_id === selectedPet);
    if (selected) {
      onPetSelect(selected);
    }
  };

  return (
    <>
      {uniquePets.length === 0 && "飼い主のペットなし"}
      <select
        defaultValue={-1}
        className="select select-accent block w-[180px]"
        onChange={handleSelectChange}
      >
        <option disabled={!uniquePets.length}>どの子を選ぶ？</option>
        {uniquePets.map((p) => (
          <option key={p.pet_id} value={p.pet_id}>
            {p.name}ちゃん
          </option>
        ))}
      </select>
      <CheckButton onClick={handleClickSelect} />
    </>
  );
};

export default SelectPet;
