import { FunctionComponent } from "react";
import {
  PopoverTrigger,
  Popover as PopoverComponent,
  PopoverContent,
} from "../ui/popover";
import { Button } from "../ui/button";

interface PopoverProps {
  title: string;
  infoText?: string;
  children: React.ReactNode;
}

const Popover: FunctionComponent<PopoverProps> = ({
  title,
  infoText,
  children,
}) => {
  return (
    <PopoverComponent>
      <PopoverTrigger asChild>
        <Button title={infoText}>{title}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-50">{children}</PopoverContent>
    </PopoverComponent>
  );
};

export default Popover;
