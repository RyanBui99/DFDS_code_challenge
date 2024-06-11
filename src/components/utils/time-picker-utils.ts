export type TimePickerType = "minutes" | "hours";

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function isValidMinute(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

export function getValidNumber(
  value: string,
  { max, min = 0, loop = false }: GetValidNumberConfig,
) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

export function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

export function getValidMinute(value: string) {
  if (isValidMinute(value)) return value;
  return getValidNumber(value, { max: 59 });
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinute(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

export function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

export function setDateByType(date: Date, value: string, type: TimePickerType) {
  switch (type) {
    case "minutes":
      return setMinutes(date, value);

    case "hours":
      return setHours(date, value);

    default:
      return date;
  }
}

export function getDateByType(date: Date, type: TimePickerType) {
  switch (type) {
    case "minutes":
      return getValidMinute(String(date.getMinutes()));

    case "hours":
      return getValidHour(String(date.getHours()));

    default:
      return "00";
  }
}
