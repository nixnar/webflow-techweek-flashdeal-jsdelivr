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
      className={`self-start shrink-0 ${
        isMobile
          ? "w-[3.625rem] aspect-square p-2"
          : "w-[3.875rem] aspect-square p-3"
      } bg-white flex items-center justify-center overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-contain" />
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
    <div className="border border-white/30 p-[4px] bg-black">
      <div className="border border-white py-3 flex flex-col gap-3 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-3">
            <VendorLogo
              src={vendor.logo}
              alt={vendor.name}
              isMobile={isMobile}
            />
            <h3 className="text-white text-[1rem] font-[700] leading-[1.25] line-clamp-3">
              {offer.name}
            </h3>
          </div>
          <div
            className="px-3 utext-white/70 text-[0.75rem] sm:text-[0.5rem] max-h-[4rem] border-b-[1px] border-white  overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(descriptionHtml),
            }}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3 px-3" uo>
          <PriceBlock offer={offer} badge={badge} value={value} />
          <button
            className={`self-start font-medium whitespace-nowrap border border-white  uppercase  bg-white text-black hover:bg-[#00e1ff] transition-colors ${
              isMobile
                ? "text-[0.875rem] py-[0.375rem] px-[0.5rem] leading-[1.25]"
                : "text-[1rem] tracking-[0.05rem] px-3 py-[10px] leading-[1.25]"
            }`}
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
      <div className="tw-discount leading-none">
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
          <>
            <span className="text-[#898989] text-[1.25rem] uppercase leading-none">
              {value.label}&nbsp;
            </span>
            <span className="text-[#898989] text-[1.25rem] font-[600] uppercase leading-none">
              {value.value}
            </span>
          </>
        ) : null}
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
    <div className="tw-discount leading-none">
      <span className="text-white text-[1.25rem] font-[600] uppercase leading-none">
        {badge.primary}&nbsp;
      </span>
      {badge.secondary ? (
        <span className="text-white text-[1.25rem] font-[600] uppercase leading-none">
          {badge.secondary}&nbsp;
        </span>
      ) : null}
      {showValue ? (
        <>
          <span className="text-[#898989] text-[1.25rem] uppercase leading-none">
            {value.label}&nbsp;
          </span>
          <span className="text-[#898989] text-[1.25rem] font-[600] uppercase leading-none">
            {value.value}
          </span>
        </>
      ) : null}
    </div>
  );
}
