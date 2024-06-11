"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "~/utils";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { TimePicker } from ".";
import { Label } from "../ui/label";

interface DatePickerProps {
  setDate: (date: Date | undefined) => void;
  date: Date;
}

const DatePicker: FunctionComponent<DatePickerProps> = ({ setDate, date }) => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

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
          {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          initialFocus
        />

        <div className="flex justify-center gap-7 pb-4">
          <div className="grid gap-1 ">
            <Label htmlFor="hours">Hours</Label>
            <TimePicker
              picker="hours"
              date={date}
              setDate={setDate}
              ref={hourRef}
            />
          </div>

          <div className="grid gap-1 ">
            <Label htmlFor="minutes">Minutes</Label>
            <TimePicker
              picker="minutes"
              date={date}
              setDate={setDate}
              ref={minuteRef}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
