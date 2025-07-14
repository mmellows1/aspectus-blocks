import colors, { colorSchemes } from "@library/colors";
import countryCodes from "@library/country-codes";
import { InspectorControls } from "@wordpress/block-editor";
import {
  DuotonePicker,
  __experimentalNumberControl as NumberControl,
  PanelBody,
  RangeControl,
  SelectControl,
} from "@wordpress/components";
import { colorThemes } from "../../lib/colors";

export default ({ attributes, setAttributes }) => {
  return (
    <InspectorControls>
      <PanelBody title="Settings">
        <SelectControl
          defaultValue={attributes.theme}
          label="Theme"
          help="Select a theme for the calculator"
          options={colorThemes}
          onChange={(theme) => {
            setAttributes({
              theme,
            });
          }}
        />
        <SelectControl
          __next40pxDefaultSize
          __nextHasNoMarginBottom
          label="Base currency"
          help="Set what the currency conversion is based off, (default GBP(£))"
          onChange={(baseCurrency) => setAttributes({ baseCurrency })}
          defaultValue={attributes.baseCurrency}
          options={countryCodes.map(({ code, symbol }) => ({
            label: `${symbol} ${code}`,
            value: code,
          }))}
        />
        <RangeControl
          label="Default days"
          value={attributes.defaultDays}
          help="Sets the default number of days users will see when they land on the page (reload to see the default day change)"
          min={0}
          max={7}
          onChange={(defaultDays) => setAttributes({ defaultDays })}
        />
        <RangeControl
          label="Default hours"
          value={attributes.defaultHours}
          help="Sets the default number of hours users will see when they land on the page (reload to see the default hours change)"
          min={0}
          max={24}
          onChange={(defaultHours) => setAttributes({ defaultHours })}
        />
        <NumberControl
          label="Profit per unit step"
          help="Set how much the profit per unit range steps between each unit (default 0.1)"
          value={attributes?.unitStep}
          onChange={(unitStep) => setAttributes({ unitStep })}
        />
      </PanelBody>
    </InspectorControls>
  );
};
