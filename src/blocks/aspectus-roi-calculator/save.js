/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import countryCodes from "@library/country-codes";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */

const CurrencyInput = ({ name, value, step, ...inputProps }) => {
  return (
    <div data-element={name}>
      <label className="wp-block-create-block-roi-calculator__form-label">
        {value}
      </label>
      <div className="wp-block-create-block-roi-calculator__form-group wp-block-create-block-roi-calculator__form-group--compact">
        <select
          className="wp-block-create-block-roi-calculator__currency-select"
          aria-label="Select country"
        >
          {countryCodes.map(({ code, symbol }) => (
            <option value={code}>
              {symbol} {code}
            </option>
          ))}
        </select>
        <input
          {...inputProps}
          type="number"
          step={step}
          className="wp-block-create-block-roi-calculator__currency-input"
          value={2.0}
          pattern="^\d*(\.\d{0,2})?$"
        />
      </div>
    </div>
  );
};
const NumberInput = ({ name, value, defaultValue, step, ...inputProps }) => {
  return (
    <div data-element={name}>
      <label className="wp-block-create-block-roi-calculator__form-label">
        {value}
      </label>
      <div className="wp-block-create-block-roi-calculator__form-group">
        <input
          {...inputProps}
          type="number"
          className="wp-block-create-block-roi-calculator__number-input"
          value={defaultValue}
        />
      </div>
    </div>
  );
};

const RangeSlider = ({ name, value, onChange, ...inputProps }) => {
  return (
    <div data-element={name}>
      <label
        as="label"
        className="wp-block-create-block-roi-calculator__form-label"
      >
        {value}
      </label>
      <div className="wp-block-create-block-roi-calculator__form-group">
        <input
          {...inputProps}
          type="range"
          className="wp-block-create-block-roi-calculator__range-input"
          onChange={(e) => setRangeValue(e.target.value)}
        />
        <span className="wp-block-create-block-roi-calculator__range-value">
          0
        </span>
      </div>
    </div>
  );
};

export default function save({ attributes }) {
  return (
    <div
      {...useBlockProps.save({
        className: [
          "wp-block-create-block-roi-calculator",
          `wp-block-create-block-roi-calculator--theme-${attributes?.theme}`,
        ].join(" "),
      })}
      data-element="aspectus-roi-calculator"
      data-base-currency={attributes?.baseCurrency}
    >
      <div className="wp-block-create-block-roi-calculator__box wp-block-create-block-roi-calculator__box--top">
        <RangeSlider
          min={0}
          max={100}
          value={attributes?.percentageIncrease}
          name="percentageIncrease"
          aria-label={attributes?.percentageIncrease}
        />
        <RangeSlider
          min={0}
          max={24}
          value={attributes?.hours}
          name="hours"
          aria-label={attributes?.hours}
        />
        <RangeSlider
          min={0}
          max={7}
          value={attributes?.days}
          name="days"
          aria-label={attributes?.days}
        />
        <RangeSlider
          min={1}
          max={52}
          value={attributes?.weeksPerYear}
          name="weeksPerYear"
          aria-label={attributes?.weeksPerYear}
        />
        <NumberInput
          value={attributes?.unitsPerHour}
          step={attributes?.unitStep}
          name="unitsPerHour"
          defaultValue={22500}
          aria-label={attributes?.unitsPerHour}
        />
        <CurrencyInput
          step={attributes.unitStep}
          value={attributes?.profitPerUnit}
          name="profitPerUnit"
          aria-label={attributes?.profitPerUnit}
        />
      </div>
      <div className="wp-block-create-block-roi-calculator__box wp-block-create-block-roi-calculator__box--bottom">
        <div className="wp-block-create-block-roi-calculator__grid wp-block-create-block-roi-calculator__grid--top">
          <div data-element="profitPerYear">
            <div
              value={attributes.profitPerYear}
              className="wp-block-create-block-roi-calculator__calculation-label"
            >
              {attributes.profitPerYear}
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value">
              1,404,000.00
            </span>
          </div>
          <div data-element="unitsPerYear">
            <div
              value={attributes.unitsPerYear}
              className="wp-block-create-block-roi-calculator__calculation-label"
            >
              {attributes.unitsPerYear}
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value">
              702,000
            </span>
          </div>
        </div>
        <div className="wp-block-create-block-roi-calculator__grid wp-block-create-block-roi-calculator__grid--bottom">
          <div data-element="hoursInAWeek">
            <div
              value=""
              className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
            >
              Hours in a week 24/7
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value wp-block-create-block-roi-calculator__calculation-value-small">
              60.00
            </span>
          </div>
          <div data-element="extraHours">
            <div
              value=""
              className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
            >
              Extra hours
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value wp-block-create-block-roi-calculator__calculation-value-small">
              0.60
            </span>
          </div>
          <div data-element="extraUnitsPerWeek">
            <div
              value=""
              className="wp-block-create-block-roi-calculator__calculation-label wp-block-create-block-roi-calculator__calculation-label--small"
            >
              Extra Units per week
            </div>
            <span className="wp-block-create-block-roi-calculator__calculation-value wp-block-create-block-roi-calculator__calculation-value-small">
              13,500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
