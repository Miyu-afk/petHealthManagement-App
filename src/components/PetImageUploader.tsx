import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface PetImageUploaderProps {
  petId: number;
  ownerId: string;
  currentImagePath?: string | null;
  onUploadComplete: (newImagePath: string) => void;
}

const PetImageUploader = ({
  petId,
  ownerId,
  currentImagePath,
  onUploadComplete,
}: PetImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const authUid = localStorage.getItem("authUid");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!authUid) {
      alert("ログイン情報がありません");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    const uniqueSuffix = crypto.randomUUID();
    const filePath = `user_${authUid}/pet_${petId}_${uniqueSuffix}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("pet-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload Error:", error.message);
      alert("画像アップロードに失敗しました");
      return;
    }

    const { error: dbError } = await supabase
      .from("pets")
      .update({ image_path: filePath })
      .eq("pet_id", petId);

    if (dbError) {
      console.error("DB Update Error:", dbError.message);
    } else {
      onUploadComplete(filePath);

      const { data: signedData, error: signedError } = await supabase.storage
        .from("pet-images")
        .createSignedUrl(filePath, 60);

      if (!signedError && signedData.signedUrl) {
        setImageUrl(signedData.signedUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {currentImagePath && imageUrl && (
        <img src={imageUrl} alt="pet" className="w-32 h-32 object-cover mb-2" />
      )}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          className="w-[120px] h-[120px] object-cover"
        />
      )}
      <label className="cursor-pointer px-4 py-2 rounded border border-gray-300">
        ファイルを選択
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default PetImageUploader;
