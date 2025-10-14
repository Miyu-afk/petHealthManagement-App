interface MemoProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Memo = ({ onChange }: MemoProps) => {
  return (
    <textarea
      className="border-2 border-solid border-teal-500 rounded-lg resize-none"
      placeholder="ひとことメモ"
      onChange={onChange}
      name="postContent"
    />
  );
};

export default Memo;
