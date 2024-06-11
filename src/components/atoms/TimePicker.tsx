import {
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  TimePickerType,
  getDateByType,
  setDateByType,
} from "../utils/time-picker-utils";
import { Input } from "../ui/input";
import { cn } from "~/utils";

export interface TimePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      type = "tel",
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
    },
    ref,
  ) => {
    const [flag, setFlag] = useState<boolean>(false);

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [flag]);

    const calculatedValue = useMemo(() => {
      return getDateByType(date, picker);
    }, [date, picker]);

    const calculateNewValue = (key: string) => {
      return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key >= "0" && e.key <= "9") {
        const newValue = calculateNewValue(e.key);
        setFlag((prev) => !prev);
        const tempDate = new Date(date);
        setDate(setDateByType(tempDate, newValue, picker));
      }
    };

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn("w-[48px] text-center focus:bg-accent")}
        value={value || calculatedValue}
        onChange={(e) => {
          e.preventDefault();
          onChange?.(e);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
      />
    );
  },
);

export default TimePicker;
