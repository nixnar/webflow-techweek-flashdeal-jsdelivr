import React from "react";
import {
  deriveBadgeFromDeal,
  deriveEstimatedValueLabel,
  sanitizeHtml,
  splitDescription,
} from "../utils/format";

const VendorLogo = ({ src, alt, isMobile }) => {
  return (
    <div
      className={`self-start ${
        isMobile ? "w-[4rem] h-[4rem] p-2" : "w-[5rem] h-[5rem] p-3"
      } bg-white flex items-center justify-center overflow-hidden`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <div className="h-6 w-6 bg-black/10" />
      )}
    </div>
  );
};

export default function OfferCard({ offer, onRedeem, isMobile }) {
  const vendor = offer.vendor || {};
  const badge = deriveBadgeFromDeal(offer);
  const value = deriveEstimatedValueLabel(offer);
  const { descriptionHtml } = splitDescription(offer.description || "");

  return (
    <div className="border border-white p-[4px] bg-black">
      <div className="border border-white p-4 flex flex-col gap-4 h-full">
        <VendorLogo src={vendor.logo} alt={vendor.name} isMobile={isMobile} />

        <div className="flex flex-col gap-2 tw-offer-text">
          <h3 className="text-white text-[1rem] font-[700] leading-tight">
            {offer.name}
          </h3>
          <div
            className="tw-offer-desc text-white/80 text-[0.75rem] sm:text-[0.5rem] leading-[1.35] "
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(descriptionHtml) }}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <PriceBlock offer={offer} badge={badge} value={value} />
          <button
            className="self-start text-[1rem] sm:text-[0.875rem] whitespace-nowrap border tracking-[0.05rem] border-white px-3 py-[10px] uppercase font-[600] leading-[1.25] bg-white text-black hover:bg-[#00e1ff] transition-colors"
            onClick={() => onRedeem?.(offer)}
          >
            Redeem Now
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceBlock({ offer, badge, value }) {
  const dealType = (offer.deal_type || "").toLowerCase();
  const showValue =
    !!value.value &&
    dealType !== "special_offer" &&
    dealType !== "special-offer";

  if (
    dealType === "discount" &&
    (offer.discount_type || "").toLowerCase() === "percentage"
  ) {
    return (
      <div className="flex flex-col gap-1">
        <div className="tw-discount flex items-end flex-wrap">
          <span className="text-white text-[1.25rem] font-[600] uppercase leading-none tracking-1">
            {offer.discount ?? 0}
          </span>
          <span className="text-white text-[1.25rem] font-[600] uppercase leading-none">
            %
          </span>
          <span className="text-white text-[1.25rem] font-[600] uppercase leading-none">
            &nbsp;OFF&nbsp;
          </span>
          {showValue ? (
            <div className="flex items-end leading-none">
              <span className="text-[#898989] text-[1rem] uppercase tracking-wide">
                {value.label}&nbsp;
              </span>
              <span className="text-[#898989] text-[1.25rem] font-[600] uppercase">
                {value.value}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (dealType === "special_offer" || dealType === "special-offer") {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-white text-[1.25rem] font-[600] uppercase">
          Special Offer
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="tw-discount flex items-end flex-wrap">
        <span className="text-white text-[1.25rem] font-[600] uppercase leading-none">
          {badge.primary}&nbsp;
        </span>
        {badge.secondary ? (
          <span className="text-white text-[1.25rem] font-[600] uppercase leading-none">
            {badge.secondary}&nbsp;
          </span>
        ) : null}
        {showValue ? (
          <div className="flex items-end leading-none">
            <span className="text-[#898989] text-[1rem] uppercase tracking-wide">
              {value.label}&nbsp;
            </span>
            <span className="text-[#898989] text-[1.25rem] font-[600] uppercase">
              {value.value}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
