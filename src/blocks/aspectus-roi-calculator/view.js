import calculateRoi from "@helpers/calculate-roi";
import calculateGradientPercentage from "@helpers/calculate-gradient";
import { formatUnits } from "../../helpers/formatter";
import { getSymbol } from "../../lib/country-codes";

(function () {
  const calculators = document.querySelectorAll(
    '[data-element="aspectus-roi-calculator"]'
  );

  calculators.forEach((element) => {
    const baseCurrency = element.getAttribute("data-base-currency") ?? "GBP";
    let currencySymbol = "£";

    const config = {
      formElements: [
        { key: "percentageIncrease", types: ["input", "span"] },
        { key: "hours", types: ["input", "span"] },
        { key: "days", types: ["input", "span"] },
        { key: "weeksPerYear", types: ["input", "span"] },
        { key: "unitsPerHour", types: ["input"] },
        { key: "profitPerUnit", types: ["input", "select"] },
      ],
      calculatedElements: [
        { key: "profitPerYear", types: ["span"] },
        { key: "unitsPerYear", types: ["span"] },
        { key: "hoursInAWeek", types: ["span"] },
        { key: "extraHours", types: ["span"] },
        { key: "extraUnitsPerWeek", types: ["span"] },
      ],
    };

    const get = (key, type) =>
      element.querySelector(`[data-element="${key}"]`)?.querySelector(type);

    const elements = Object.fromEntries(
      config.formElements.map(({ key, types }) => [
        key,
        Object.fromEntries(
          types.map((type) => [
            type === "select"
              ? "currency"
              : type === "span"
              ? "value"
              : "input",
            get(key, type),
          ])
        ),
      ])
    );

    const calculatedElements = Object.fromEntries(
      config.calculatedElements.map(({ key, types }) => [
        key,
        Object.fromEntries(
          types.map((type) => [
            type === "span" ? "value" : "input",
            get(key, type),
          ])
        ),
      ])
    );

    const getGradientColor = (value, max) => {
      return `linear-gradient(
        to right,
        var(--secondary-color) 0%,
        var(--secondary-color) ${calculateGradientPercentage(value, max)}%,
        #fff ${calculateGradientPercentage(value, max)}%,
        #fff 100%
      )`;
    };

    const setGradientColor = (el, value, max) => {
      el.style.background = getGradientColor(value, max);
    };

    const formatUnitInput = (el) => {
      el.value = formatUnits(Number(el.value));
    };

    const calculate = (rate) => {
      const roi = calculateRoi({
        percentageIncrease: parseFloat(elements.percentageIncrease.input.value),
        hours: parseFloat(elements.hours.input.value),
        days: parseFloat(elements.days.input.value),
        weeksPerYear: parseFloat(elements.weeksPerYear.input.value),
        unitsPerHour: parseFloat(elements.unitsPerHour.input.value),
        profitPerUnit: parseFloat(elements.profitPerUnit.input.value),
        rate: rate ?? 1,
      });
      const {
        profitPerYear,
        unitsPerYear,
        hoursInAWeek,
        extraHours,
        extraUnitsPerWeek,
      } = roi;

      Object.entries(calculatedElements).forEach(([key, el]) => {
        // if (el.input) {
        //   el.input.value = roi[key];
        // } else {
        if (key == "profitPerYear") {
          el.value.textContent = `${currencySymbol} ${roi[key]}`;
        } else {
          el.value.textContent = roi[key];
        }
        // }
      });
    };

    Object.entries(elements).forEach(([key, el]) => {
      if (el.input.type === "range") {
        el.value.textContent = el.input.value;
        setGradientColor(
          el.input,
          Number(el.input.value),
          Number(el.input.max)
        );
        el.input.addEventListener("input", (e) => {
          setGradientColor(
            el.input,
            Number(el.input.value),
            Number(el.input.max)
          );
          if (el.value) {
            el.value.textContent = e.target.value;
          }
          calculate();
        });
      } else if (el.input.type == "number") {
        if (key == "profitPerUnit") {
          formatUnitInput(el.input);
          el.input.addEventListener("input", (e) => {
            formatUnitInput(el.input);
            calculate();
          });
        } else {
          el.input.addEventListener("change", (e) => calculate());
        }
      }

      if (el.currency) {
        el.currency.addEventListener("change", (e) => {
          currencySymbol = getSymbol(e.target.value);
          fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
            .then((res) => {
              return res.json();
            })
            .then((currency) => {
              let rate = currency.rates[e.target.value];

              calculate(rate);
            });
        });
      }
    });

    calculate();
  });
})();
