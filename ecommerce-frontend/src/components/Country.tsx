import React, { useState } from "react";
import { CountrySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

export default function CountrySelector() {
  const [country, setCountry] = useState(null);

  return (
    <div>
      <h6>Country</h6>
      <CountrySelect
        containerClassName="form-group"
        inputClassName=""
        onChange={() => setCountry(country)}
        onTextChange={(_txt) => console.log(_txt)}
        placeHolder="Select Country"
      />
    </div>
  );
}