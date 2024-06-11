"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "~/utils";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FunctionComponent } from "react";

interface DatePickerProps {
  setDate: (date: Date) => void;
  date: Date;
}

const DatePicker: FunctionComponent<DatePickerProps> = ({ setDate, date }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-9.5 justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
