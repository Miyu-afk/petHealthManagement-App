import PetHealthBody from "./components/PetHealthBody";
import PetHealthFooter from "./components/PetHealthFooter";
import PetHealthHeader from "./components/PetHealthHeader";
import SuccessModal from "./components/SuccessModal";
import { useState, useEffect } from "react";
import React from "react";

const API_URL = "http://localhost:3000/pets";

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

const App = () => {
  const [petsData, setPetsData] = useState<Pet[] | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const openModal = () => {
    const modal = document.getElementById("modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  useEffect(() => {
    fetchPet();
  }, []);

  const fetchPet = () => {
    fetch(API_URL)
      .then((responseData) => {
        return responseData.json();
      })
      .then((json) => setPetsData(json || null))
      .catch(() => alert("error"));
  };

  const addHealth = (newHealthData: Partial<Pet>) => {
    fetch(API_URL, {
      body: JSON.stringify(newHealthData),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        fetchPet();
      })
      .catch((error) => {
        console.error("Error:", error);
      });      
  };

 const handlePetSelected = (SelectedPet: Pet) => {
    setSelectedPet(SelectedPet); 
  };

  return (
    <>
      <PetHealthHeader />
      <PetHealthBody
        SuccessModalOpen={openModal}
        addHealth={addHealth}
        petsData={petsData}
        onChildSelectedPet={handlePetSelected}
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

export default App;
