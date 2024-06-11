import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Sheet as SheetComponent,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";

interface SheetProps {
  children: React.ReactNode;
  buttonTitle: string;
  title: string;
  description: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const Sheet: FunctionComponent<SheetProps> = ({
  title,
  description,
  buttonTitle,
  children,
  setOpen,
  open,
}) => {
  return (
    <SheetComponent onOpenChange={setOpen} open={open}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {buttonTitle}
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </SheetComponent>
  );
};

export default Sheet;
