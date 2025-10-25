import CheckButton from "./CheckButton";

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

interface SuccessModalProps {
  SuccessModalOpen: () => void;
  petsData: Pet[] | null;
  selectedPet: Pet | null;
}

const SuccessModal = ({
  SuccessModalOpen,
  petsData,
  selectedPet,
}: SuccessModalProps) => {
  return (
    <>
      <dialog id="modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            <CheckButton onClick={SuccessModalOpen} />
          </h3>
          <p className="py-4">
            無事、{selectedPet ? selectedPet.name : "???"}
            ちゃんのけんこう度が保存されました！
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">閉じる</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SuccessModal;
