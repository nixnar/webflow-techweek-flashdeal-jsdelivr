import React from "react";
import OfferCard from "./OfferCard";

export default function OfferGrid({ offers, onRedeem, isMobile }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onRedeem={onRedeem}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
