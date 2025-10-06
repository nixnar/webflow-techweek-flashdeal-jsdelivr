import React from "react";
import OfferCard from "./OfferCard";

export default function OfferGrid({ offers, onRedeem, isMobile }) {
  const [columns, setColumns] = React.useState(1);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1400) {
        setColumns(4);
      } else if (width >= 1075) {
        setColumns(3);
      } else if (width >= 750) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return (
    <div
      className="grid gap-4 gap-y-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
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
