import { ChangeEventHandler, useMemo, useState } from "react";

interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

export default function Switch({
  disabled,
  onChange,
  label,
  checked,
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(false);

  const value = useMemo(() => checked ?? isChecked, [checked, isChecked]);

  const toggleSwitch = () => setIsChecked(!isChecked);

  return (
    <label
      className={`ui-flex ui-items-center ${disabled == true ? "ui-opacity-30 ui-cursor-not-allowed" : "ui-cursor-pointer"}`}
    >
      <div className="ui-relative">
        <input
          disabled={disabled}
          type="checkbox"
          className="ui-sr-only"
          checked={value}
          onChange={onChange ?? toggleSwitch}
        />
        <div
          className={`ui-block ui-w-9 ui-h-5 ui-rounded-full ${
            value ? "ui-bg-blue-600" : "ui-bg-neutral-200/40"
          }`}
        ></div>
        <div
          className={`ui-absolute ui-left-0.5 ui-top-0.5  ui-w-4 ui-h-4 ui-rounded-full ui-transition-transform ui-duration-300 ui-ease-in-out ${
            value
              ? "ui-transform ui-translate-x-full ui-bg-neutral-200"
              : "ui-bg-neutral-200"
          }`}
        ></div>
      </div>
      {label && <span className="ui-ml-3 ui-text-gray-700">{label}</span>}
    </label>
  );
}
