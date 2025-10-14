interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  onIcon: JSX.Element;
  offIcon: JSX.Element;
  onOrOff: boolean;
}

const ToggleButton = ({
  isOn,
  onToggle,
  onIcon,
  offIcon,
  onOrOff,
}: ToggleButtonProps) => {
  return (
    <button onClick={onToggle} disabled={onOrOff}>
      {isOn ? onIcon : offIcon}
    </button>
  );
};

export default ToggleButton;
