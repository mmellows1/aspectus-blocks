import { formatComma } from "./formatter";

export default function calculateRoi(matrix) {
  const {
    percentageIncrease,
    hours,
    days,
    weeksPerYear,
    unitsPerHour,
    profitPerUnit,
    rate,
  } = matrix;

  const hoursInAWeek = hours * days;
  const extraHours = Math.round(percentageIncrease * (hoursInAWeek / 100));
  const extraUnitsPerWeek = unitsPerHour * extraHours;
  const unitsPerYear = Math.round(extraUnitsPerWeek * weeksPerYear);
  const adjustedProfitPerUnit = profitPerUnit * rate;
  const profitPerYear = Math.round(adjustedProfitPerUnit * unitsPerYear);

  return {
    profitPerYear: formatComma(profitPerYear),
    unitsPerYear: formatComma(unitsPerYear),
    hoursInAWeek,
    extraHours,
    extraUnitsPerWeek: formatComma(extraUnitsPerWeek),
  };
}
