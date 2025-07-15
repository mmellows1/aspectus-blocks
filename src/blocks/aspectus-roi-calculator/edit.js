import calculateRoi from "@helpers/calculate-roi";
import countryCodes from "@library/country-codes";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { useEffect, useRef, useState } from "@wordpress/element";
import { getSymbol } from "../../lib/country-codes";
import BlockSettings from "./BlockSettings";
import "./editor.scss";
import { formatUnits } from "../../helpers/formatter";
import { edit, Icon } from "@wordpress/icons";
import { Flex, FlexBlock, FlexItem } from "@wordpress/components";

const CurrencyInput = ({
  value,
  onChange,
  placeholder,
  currencySelectName,
  onInputChange,
  defaultCurrencyValue,
  ...inputProps
}) => {
  const [currencyValue, setCurrencyValue] = useState(defaultCurrencyValue);

  const handleInputChange = (e) => {
    if (e.target.type === "number") {
      setCurrencyValue(e.target.value);
    }
    if (onInputChange) {
      onInputChange(e);
    }
  };

  return (
    <div>
      <Flex align="center" justify="start">
        <FlexItem>
          <RichText
            placeholder={placeholder}
            value={value}
            className="wp-block-create-block-roi-calculator__form-label"
            onChange={(value) => onChange(value)}
          />
        </FlexItem>
        <FlexItem>
          <Icon icon={edit} fill="white" />
        </FlexItem>
      </Flex>
      <div className="wp-block-create-block-roi-calculator__form-group wp-block-create-block-roi-calculator__form-group--compact">
        <select
          name={currencySelectName}
          defaultValue={value}
          className="wp-block-create-block-roi-calculator__currency-select"
          onChange={handleInputChange}
          aria-label="Select currency"
        >
          {countryCodes.map(({ code, symbol }) => (
            <option value={code}>
              {symbol} {code}
            </option>
          ))}
        </select>
        <input
          {...inputProps}
          onChange={handleInputChange}
          type="number"
          min={0}
          className="wp-block-create-block-roi-calculator__currency-input"
          value={formatUnits(currencyValue)}
          pattern="^\d*(\.\d{0,2})?$"
          aria-label={placeholder}
        />
      </div>
    </div>
  );
};
const NumberInput = ({
  value,
  onChange,
  placeholder,
  onInputChange,
  ...inputProps
}) => {
  const handleInputChange = (e) => {
    if (onInputChange) {
      onInputChange(e);
    }
  };

  return (
    <div>
      <Flex align="center" justify="start">
        <FlexItem>
          <RichText
            placeholder={placeholder}
            value={value}
            className="wp-block-create-block-roi-calculator__form-label"
            onChange={(value) => onChange(value)}
          />
        </FlexItem>
        <FlexItem>
          <Icon icon={edit} fill="white" />
        </FlexItem>
      </Flex>
      <div className="wp-block-create-block-roi-calculator__form-group">
        <input
          {...inputProps}
          aria-label={placeholder}
          onChange={handleInputChange}
          type="number"
          className="wp-block-create-block-roi-calculator__number-input"
        />
      </div>
    </div>
  );
};

const RangeSlider = ({
  value,
  onChange,
  placeholder,
  min,
  onInputChange,
  defaultRangeValue,
  max,
  ...inputProps
}) => {
  const [rangeValue, setRangeValue] = useState(defaultRangeValue);
  const inputRef = useRef(null);

  const calculateGradientPercentage = () => {
    return (Number(rangeValue) / max) * 100;
  };

  useEffect(() => {
    setRangeValue(inputRef.current.value);
  }, []);

  useEffect(() => {
    const rangePercentage = calculateGradientPercentage();
    inputRef.current.style.background = `linear-gradient(
      to right,
      var(--secondary-color) 0%,
      var(--secondary-color) ${rangePercentage}%,
      #fff ${rangePercentage}%,
      #fff 100%
    )`;
  }, [rangeValue]);

  const handleInputChange = (e) => {
    setRangeValue(e.target.value);
    if (onInputChange) {
      onInputChange(e);
    }
  };

  return (
    <div>
      <Flex align="center" justify="start">
        <FlexItem>
          <RichText
            placeholder={placeholder}
            value={value}
            className="wp-block-create-block-roi-calculator__form-label"
            onChange={(value) => onChange(value)}
          />
        </FlexItem>
        <FlexItem>
          <Icon icon={edit} fill="white" />
        </FlexItem>
      </Flex>
      <div className="wp-block-create-block-roi-calculator__form-group">
        <input
          {...inputProps}
          min={min}
          max={max}
          ref={inputRef}
          value={rangeValue}
          onChange={handleInputChange}
          type="range"
          aria-label={placeholder}
          className="wp-block-create-block-roi-calculator__range-input"
        />
        <span className="wp-block-create-block-roi-calculator__range-value">
          {rangeValue}
        </span>
      </div>
    </div>
  );
};

export default function Edit({ attributes, setAttributes }) {
  const [matrix, setMatrix] = useState({
    percentageIncrease: 50,
    hours: attributes.defaultHours,
    days: attributes.defaultDays,
    weeksPerYear: 50,
    unitsPerHour: 22500,
    profitPerUnit: 0.0,
    rate: 1,
    currency: "GBP",
  });
  const [symbol, setSymbol] = useState(getSymbol(matrix.currency));
  const [roi, setRoi] = useState(calculateRoi(matrix));

  const handleInputChange = (e) => {
    setMatrix({
      ...matrix,
      [e.target.name]:
        e.target.type === "number" || e.target.type === "range"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  useEffect(() => {
    setRoi(calculateRoi(matrix));
  }, [JSON.stringify(matrix)]);

  useEffect(() => {
    fetch(
      `https://api.exchangerate-api.com/v4/latest/${attributes.baseCurrency}`
    )
      .then((res) => res.json())
      .then((currency) => {
        let rate = currency.rates[matrix.currency];
        setSymbol(getSymbol(matrix.currency));
        setMatrix({
          ...matrix,
          rate,
        });
      });
  }, [matrix.currency, attributes.baseCurrency]);

  return (
    <div
      {...useBlockProps({
        className: [
          "wp-block-create-block-roi-calculator",
          `wp-block-create-block-roi-calculator--theme-${attributes.theme}`,
        ].join(" "),
      })}
    >
      <BlockSettings attributes={attributes} setAttributes={setAttributes} />
      <div className="wp-block-create-block-roi-calculator__box wp-block-create-block-roi-calculator__box--top">
        <RangeSlider
          min={0}
          max={100}
          name="percentageIncrease"
          value={attributes?.percentageIncrease}
          placeholder="Enter a label (e.g. Percentage Increase)"
          defaultRangeValue={matrix.percentageIncrease}
          onChange={(value) => {
            setAttributes({
              percentageIncrease: value,
            });
          }}
          onInputChange={handleInputChange}
        />
        <RangeSlider
          min={0}
          max={24}
          name="hours"
          value={attributes?.hours}
          placeholder="Enter a label (e.g. Hours)"
          defaultRangeValue={matrix.hours}
          onChange={(value) => {
            setAttributes({
              hours: value,
            });
          }}
          onInputChange={handleInputChange}
        />
        <RangeSlider
          min={0}
          max={7}
          name="days"
          value={attributes?.days}
          defaultRangeValue={matrix.days}
          placeholder="Enter a label (e.g. Days)"
          onChange={(value) => {
            setAttributes({
              days: value,
            });
          }}
          onInputChange={handleInputChange}
        />
        <RangeSlider
          min={0}
          max={52}
          name="weeksPerYear"
          value={attributes?.weeksPerYear}
          defaultRangeValue={matrix.weeksPerYear}
          placeholder="Enter a label (e.g. Weeks per year)"
          onChange={(value) => {
            setAttributes({
              weeksPerYear: value,
            });
          }}
          onInputChange={handleInputChange}
        />
        <NumberInput
          name="unitsPerHour"
          value={attributes?.unitsPerHour}
          defaultNumberValue={matrix.unitsPerHour}
          placeholder="Enter a label (e.g. Units per hour)"
          defaultValue={22500}
          onChange={(value) => {
            setAttributes({
              unitsPerHour: value,
            });
          }}
          onInputChange={handleInputChange}
        />
        <CurrencyInput
          name="profitPerUnit"
          currencySelectName="currency"
          value={attributes?.profitPerUnit}
          step={attributes?.unitStep}
          defaultCurrencyValue={matrix.profitPerUnit}
          placeholder="Enter a label (e.g. Profit per unit)"
          onChange={(value) => {
            setAttributes({
              profitPerUnit: value,
            });
          }}
          onInputChange={handleInputChange}
        />
      </div>
      <div className="wp-block-create-block-roi-calculator__box wp-block-create-block-roi-calculator__box--bottom">
        <div className="wp-block-create-block-roi-calculator__grid wp-block-create-block-roi-calculator__grid--top">
          <div className="">
            <Flex justify="center">
              <FlexItem>
                <RichText
                  placeholder="Enter a label (e.g. Profit per year)"
                  value={attributes.profitPerYear}
                  className="wp-block-create-block-roi-calculator__calculation-label"
                  onChange={(profitPerYear) => setAttributes({ profitPerYear })}
                />
              </FlexItem>
              <FlexItem>
                <Icon icon={edit} fill="white" />
              </FlexItem>
            </Flex>
            <span className="wp-block-create-block-roi-calculator__calculation-value">
              {symbol} {roi?.profitPerYear}
            </span>
          </div>
          <div className="">
            <Flex justify="center">
              <FlexItem>
                <RichText
                  placeholder="Enter a label (e.g. Units per year)"
                  value={attributes.unitsPerYear}
                  className="wp-block-create-block-roi-calculator__calculation-label"
                  onChange={(unitsPerYear) => setAttributes({ unitsPerYear })}
                />
              </FlexItem>
              <FlexItem>
                <Icon icon={edit} fill="white" />
              </FlexItem>
            </Flex>
            <span className="wp-block-create-block-roi-calculator__calculation-value">
              {roi?.unitsPerYear}
            </span>
          </div>
        </div>
        <div className="wp-block-create-block-roi-calculator__grid wp-block-create-block-roi-calculator__grid--bottom">
          <div className="">
            <div
              value=""
              className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
            >
              <Flex justify="center">
                <FlexItem>
                  <RichText
                    placeholder="Enter a label (e.g. Hours in a week 24/7)"
                    value={attributes.hoursInAWeek}
                    className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
                    onChange={(hoursInAWeek) => setAttributes({ hoursInAWeek })}
                  />
                </FlexItem>
                <FlexItem>
                  <Icon icon={edit} fill="white" />
                </FlexItem>
              </Flex>
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value wp-block-create-block-roi-calculator__calculation-value-small">
              {roi?.hoursInAWeek}
            </span>
          </div>
          <div className="">
            <div
              value=""
              className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
            >
              <Flex justify="center">
                <FlexItem>
                  <RichText
                    placeholder="Enter a label (e.g. Extra hours)"
                    value={attributes.extraHours}
                    className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
                    onChange={(extraHours) => setAttributes({ extraHours })}
                  />
                </FlexItem>
                <FlexItem>
                  <Icon icon={edit} fill="white" />
                </FlexItem>
              </Flex>
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value wp-block-create-block-roi-calculator__calculation-value-small">
              {roi?.extraHours}
            </span>
          </div>
          <div className="">
            <div
              value=""
              className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
            >
              <Flex justify="center">
                <FlexItem>
                  <RichText
                    placeholder="Enter a label (e.g. Extra Units per week)"
                    value={attributes.extraUnitsPerWeek}
                    className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
                    onChange={(extraUnitsPerWeek) =>
                      setAttributes({ extraUnitsPerWeek })
                    }
                  />
                </FlexItem>
                <FlexItem>
                  <Icon icon={edit} fill="white" />
                </FlexItem>
              </Flex>
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value wp-block-create-block-roi-calculator__calculation-value-small">
              {roi?.extraUnitsPerWeek}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
