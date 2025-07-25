import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-black rounded-md w-9 font-normal text-[0.8rem] dark:text-white",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-gray-800",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black",
        day_today: "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
        day_outside:
          "day-outside text-black opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-black aria-selected:opacity-30 dark:text-white dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-white",
        day_disabled: "text-black opacity-50 dark:text-white",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-black dark:aria-selected:bg-gray-800 dark:aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar }; 