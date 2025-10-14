import PetHealthBody from "./components/PetHealthBody";
import PetHealthFooter from "./components/PetHealthFooter";
import PetHealthHeader from "./components/PetHealthHeader";
import SuccessModal from "./components/SuccessModal";
import { useState, useEffect } from "react";
import React from "react";


// const API_URL = "http://localhost:3000/pets";

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


const PetHealthMain: React.FC = () => {
  const [petsData, setPetsData] = useState<Pet[] | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [newPet, setNewPet] = useState<Pet | null>(null);

  const openModal = () => {
    const modal = document.getElementById("modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const fetchPets = async () => {
    const ownerId = localStorage.getItem("userId");
    if(!ownerId){
      alert("ログイン情報が見つかりません");
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase.from("pets").select("*").eq("owner_id", ownerId);
    if (error) {
      console.error("Supabase Fetch Error:", error.message);
      alert("データ取得に失敗しました。");
      return;
    }
    setPetsData(data as Pet[]);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const addHealth = async (newHealthData: Partial<Pet>) => {
    const { error } = await supabase.from("pets").insert([newHealthData]);
    if (error) {
      console.error("Supabase Insert Error:", error.message);
      alert("登録に失敗しました。");
    } else {
      await fetchPets();
    }
  };

  const addPet = async (newPetData: Partial<Pet>) => {
    const { data, error } = await supabase.from("pets").insert([newPetData]).select().single();

    if (error) {
      console.error("Supabase Insert Error:", error.message);
      alert("新しいペットの登録に失敗しました。");
      return null;
    }

    setNewPet(data);

    await fetchPets();
  };


  

  const handlePetSelected = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <>
      <PetHealthHeader />
      <PetHealthBody
        SuccessModalOpen={openModal}
        addHealth={addHealth}
        petsData={petsData}
        onChildSelectedPet={handlePetSelected}
        onChildAddPet={addPet}
        newPet={newPet}
      />
      <SuccessModal
        SuccessModalOpen={openModal}
        petsData={petsData}
        selectedPet={selectedPet}
      />
      <PetHealthFooter />
    </>
  );
};

export default PetHealthMain;
