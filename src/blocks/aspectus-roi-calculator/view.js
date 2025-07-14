import calculateRoi from "@helpers/calculate-roi";

(function () {
  const calculators = document.querySelectorAll(
    '[data-element="aspectus-roi-calculator"]'
  );

  calculators.forEach((element) => {
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
        if (el.input) {
          el.input.value = roi[key];
        } else {
          el.value.textContent = roi[key];
        }
      });
    };

    Object.entries(elements).forEach(([key, el]) => {
      if (el.input.type === "range") {
        el.value.textContent = el.input.value;
        el.input.addEventListener("input", (e) => {
          if (el.value) {
            el.value.textContent = e.target.value;
          }
          calculate();
        });
      } else if (el.input.type == "number") {
        el.input.addEventListener("change", (e) => calculate());
      }

      if (el.currency) {
        el.currency.addEventListener("change", (e) => {
          fetch(`https://api.exchangerate-api.com/v4/latest/GBP`)
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
