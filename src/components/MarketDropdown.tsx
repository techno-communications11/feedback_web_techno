"use client";

import React, { useEffect, useState } from "react";
import Inputbox from "./Inputbox";

interface Market {
  market_id: string;
  market_name: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarketDropdown({ value, onChange }: Props) {
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    fetch("/api/markets")
      .then((res) => res.json())
      .then((data) => setMarkets(data.data))
      .catch(console.error);
  }, []);

 

  return (
    <div className="mb-3">
      <label className="form-label">
        Market <span className="text-danger">*</span>
      </label>

      {/* Dropdown */}
      <Inputbox
        type="dropdown"
        name="market"
        value={value}
        onChange={onChange}
        options={markets.map((m) => ({
          id: m.market_id,
          name: m.market_name,
        }))}
      />
    </div>
  );
}
