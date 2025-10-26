import { useEffect, useState } from "react";
import CheckButton from "./CheckButton";
import { supabase } from "../lib/supabaseClient";

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

interface SelectPetsProps {
  petsData: Pet[];
  onPetSelect: (pet: Pet) => void;
  addPet: (newPetData: Partial<Pet>) => void;
  ownerId: string | null | undefined;
}

const SelectPet = ({ petsData, onPetSelect, addPet }: SelectPetsProps) => {
  // const cats = catList[1]

  // for(let i = 0; i <= cats.length; i++){
  //   const catsName = cats[i].name;
  // }

  const [selectedPet, setSelectedPet] = useState<number | string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const authUid = localStorage.getItem("authUid");

  const ownersPets = petsData.filter((pet) => pet.owner_id === authUid);
  const seen = new Set<number>();
  const uniquePets = ownersPets.filter(
    (pet) => !seen.has(pet.pet_id) && seen.add(pet.pet_id)
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPet(value === "new" ? "new" : Number(value));
  };

  const handleClickSelect = () => {
    if (selectedPet === null) return;

    if (String(selectedPet) === "new") {
      setShowNameInput(true);
      return;
    }

    const selected = petsData.find((pet) => pet.pet_id === selectedPet);
    if (selected) {
      onPetSelect(selected);
    }
  };

  useEffect(() => {
    if (uniquePets.length === 0) {
      setSelectedPet("new");
      setShowNameInput(true);
    }
  }, [uniquePets]);

  return (
    <>
      <div>
        <div className="flex">
          <select
            defaultValue=""
            className="select select-accent block w-[180px]"
            onChange={handleSelectChange}
          >
            <option disabled={!uniquePets.length}>どの子を選ぶ？</option>
            {uniquePets.map((p) => (
              <option key={p.pet_id} value={p.pet_id}>
                {p.name}ちゃん
              </option>
            ))}
            <option value="new">新しい子を追加する</option>
          </select>
          <CheckButton onClick={handleClickSelect} />
        </div>

        {showNameInput && (
          <div className="mt-8 flex items-center justify-center">
            <input
              type="text"
              placeholder="名前を入力してください"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              className="input input-bordered w-[180px]"
            />

            <CheckButton
              onClick={async () => {
                if (!newPetName) return alert("名前を入力してください");

                const { data: allPetData } = await supabase
                  .from("pets")
                  .select("*")

                if (!allPetData) return;
                const maxPet =
                  allPetData.length > 0
                    ? Math.max(...allPetData.map((p) => p.pet_id))
                    : 0;

                if (authUid) {
                  const newPet: Partial<Pet> = {
                    name: newPetName,
                    mood: null,
                    poop: null,
                    meal: null,
                    vitality: null,
                    record: null,
                    owner_id: authUid,
                    pet_id: maxPet + 1,
                  };

                  addPet(newPet);
                  setShowNameInput(false);
                  setNewPetName("");
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SelectPet;
