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
        isMobile ? "w-[4.75rem] h-[4.75rem] p-2" : "w-[4.75rem] h-[4.75rem] p-4"
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

  const isSpeedrun = (vendor.services || []).some(
    (s) => s?.name === "A16z Speedrun Portfolio"
  );

  return (
    <div className="border-[1px] border-[#989898] bg-[#1D1B17]/80 flex flex-col h-full gap-3">
      <div className="flex items-start border-b-[1px] border-[#989898]">
        <VendorLogo src={vendor.logo} alt={vendor.name} isMobile={isMobile} />
        <div
          className="flex items-center h-full w-full justify-between overflow-hidden relative"
          style={
            isSpeedrun
              ? {
                  background:
                    "linear-gradient(0deg, rgba(247, 1, 255, 0.08) 0%, rgba(247, 1, 255, 0.08) 100%), #000",
                }
              : {}
          }
        >
          {isSpeedrun && <SpeedrunBackground />}
          <div
            className={`flex flex-col text-white flex-1 px-[0.62rem] items-start justify-center h-full relative w-full`}
          >
            <div
              className={`text-[1rem] font-[700] leading-[1.1] uppercase tracking-[0.02rem]`}
            >
              {vendor.name}
            </div>
            <div
              className={`text-white text-[0.875rem] font-[700] leading-[1.25] tracking-[-0.02188rem] line-clamp-2`}
            >
              {offer.name}
            </div>
          </div>
          {isSpeedrun && (
            <div
              className="text-white border-r-[1px] border-[#989898] text-[0.75rem] font-[700] tracking-[0.015em] uppercase whitespace-nowrap px-[0.19rem] py-[0.44rem] flex items-center justify-center relativeuo"
              style={{
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              Speedrun
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 px-3 pb-3">
        <div
          className="text-white opacity-80 max-h-[4.5rem] min-h-[4.5rem] overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(descriptionHtml),
          }}
        />
        <div className="flex items-center gap-2 border-[1px] border-white/65 bg-white/5">
          <div className="flex-1 min-w-0">
            <PriceBlock
              offer={offer}
              badge={badge}
              value={value}
              isMobile={isMobile}
              isSpeedrun={isSpeedrun}
            />
          </div>

          <button
            className="flex-shrink-0 w-[4.5rem] p-2 h-full flex items-center justify-center bg-white border-[1px] border-white text-[0.875rem] font-[700] uppercase tracking-[0.0175rem] leading-[1.35] text-black"
            onClick={() => onRedeem?.(offer)}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceBlock({ offer, badge, value, isMobile, isSpeedrun }) {
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
      <div className="leading-[1.35] text-[0.875rem] font-[700] tracking-[-0.02188rem] px-[0.62rem] py-[0.53rem] text-white">
        <span
          className={`whitespace-nowrap ${
            isSpeedrun ? "text-white" : "text-white"
          }`}
        >
          {offer.discount ?? 0}% OFF
        </span>
        {showValue ? (
          <span className="text-white/65 font-[500] leading-[1.25]">
            {" "}
            {value.label} {value.value}
          </span>
        ) : null}
      </div>
    );
  }

  if (dealType === "special_offer" || dealType === "special-offer") {
    return (
      <div className="leading-[1.35] text-[0.875rem] font-[700] tracking-[-0.02188rem] px-[0.62rem] text-white">
        Special Offer
      </div>
    );
  }

  return (
    <div className="leading-[1.35] text-[0.875rem] font-[700] tracking-[-0.02188rem] px-[0.62rem] text-white">
      <span
        className={`whitespace-nowrap ${
          isSpeedrun ? "text-white" : "text-white"
        }`}
      >
        {badge.primary}
        {badge.secondary ? ` ${badge.secondary}` : ""}
      </span>
      {showValue ? (
        <span className="text-white/65 font-[500] leading-[1.25]">
          {" "}
          {value.label} {value.value}
        </span>
      ) : null}
    </div>
  );
}

const SpeedrunBackground = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="97"
    height="75"
    viewBox="0 0 97 75"
    fill="none"
    className="absolute right-2 top-1/2 -translate-y-1/2"
  >
    <g opacity="0.9">
      <path
        d="M0.630773 -0.387451H2.83496V4.3369H0.630773V-0.387451Z"
        fill="#3557FF"
      />
      <path
        d="M7.28231 -0.387451H9.59082V4.3369H7.28231V-0.387451Z"
        fill="#527AFF"
      />
      <path
        d="M7.33487 4.33691H9.53906V9.06126H7.33487V4.33691Z"
        fill="#3459FF"
      />
      <path
        d="M14.0122 -0.387451H16.2686V4.3369H14.0122V-0.387451Z"
        fill="#4452FF"
      />
      <path
        d="M14.0246 9.06104H16.2549V13.7854H14.0246V9.06104Z"
        fill="#4343FF"
      />
      <path
        d="M20.7163 -0.387451H22.9727V4.3369H20.7163V-0.387451Z"
        fill="#4469FF"
      />
      <path
        d="M20.6507 4.33691H23.0244V9.06126H20.6507V4.33691Z"
        fill="#6161FF"
      />
      <path
        d="M20.7029 13.7952H22.9854V18.5195H20.7029V13.7952Z"
        fill="#5A4CFF"
      />
      <path
        d="M27.4589 -0.387451H29.6631V4.3369H27.4589V-0.387451Z"
        fill="#365EFF"
      />
      <path
        d="M27.3675 4.33691H29.7412V9.06126H27.3675V4.33691Z"
        fill="#7064FF"
      />
      <path
        d="M27.3675 9.06104H29.7412V13.7854H27.3675V9.06104Z"
        fill="#7064FF"
      />
      <path
        d="M27.4197 13.7952H29.7021V18.5195H27.4197V13.7952Z"
        fill="#7E4BFF"
      />
      <path
        d="M34.163 -0.387451H36.3672V4.3369H34.163V-0.387451Z"
        fill="#5437FF"
      />
      <path
        d="M34.1496 4.33691H36.3799V9.06126H34.1496V4.33691Z"
        fill="#4040FF"
      />
      <path
        d="M34.1496 9.06104H36.3799V13.7854H34.1496V9.06104Z"
        fill="#4040FF"
      />
      <path
        d="M34.1754 18.519H36.3535V23.2434H34.1754V18.519Z"
        fill="#4C23FF"
      />
      <path
        d="M40.8145 -0.387451H43.123V4.3369H40.8145V-0.387451Z"
        fill="#5757FF"
      />
      <path
        d="M40.8012 4.33691H43.1357V9.06126H40.8012V4.33691Z"
        fill="#675CFF"
      />
      <path
        d="M40.8012 9.06104H43.1357V13.7854H40.8012V9.06104Z"
        fill="#675CFF"
      />
      <path
        d="M40.8279 13.7952H43.1104V18.5195H40.8279V13.7952Z"
        fill="#AB4EFF"
      />
      <path
        d="M40.8279 18.519H43.1104V23.2434H40.8279V18.519Z"
        fill="#AB4EFF"
      />
      <path
        d="M47.5571 -0.387451H49.8135V4.3369H47.5571V-0.387451Z"
        fill="#F249FF"
      />
      <path
        d="M47.5705 4.33691H49.8008V9.06126H47.5705V4.33691Z"
        fill="#FF39FF"
      />
      <path
        d="M47.5705 9.06104H49.8008V13.7854H47.5705V9.06104Z"
        fill="#FF39FF"
      />
      <path
        d="M47.5447 13.7952H49.8271V18.5195H47.5447V13.7952Z"
        fill="#FF52CC"
      />
      <path
        d="M47.5447 18.519H49.8271V23.2434H47.5447V18.519Z"
        fill="#FF52CC"
      />
      <path
        d="M47.4275 27.9768H49.9316V32.7012H47.4275V27.9768Z"
        fill="#FF84DA"
      />
      <path
        d="M54.2354 -0.387451H56.5439V4.3369H54.2354V-0.387451Z"
        fill="#5A5AFF"
      />
      <path
        d="M54.2612 4.33691H56.5176V9.06126H54.2612V4.33691Z"
        fill="#5448FF"
      />
      <path
        d="M54.2612 9.06104H56.5176V13.7854H54.2612V9.06104Z"
        fill="#5448FF"
      />
      <path
        d="M54.2354 13.7952H56.5439V18.5195H54.2354V13.7952Z"
        fill="#FF52F4"
      />
      <path
        d="M54.2354 18.519H56.5439V23.2434H54.2354V18.519Z"
        fill="#FF52F4"
      />
      <path
        d="M54.2354 27.9768H56.5439V32.7012H54.2354V27.9768Z"
        fill="#FF5AB7"
      />
      <path
        d="M60.8997 -0.387451H63.2734V4.3369H60.8997V-0.387451Z"
        fill="#6262FF"
      />
      <path
        d="M60.9654 4.33691H63.2217V9.06126H60.9654V4.33691Z"
        fill="#5F4AFF"
      />
      <path
        d="M60.9654 9.06104H63.2217V13.7854H60.9654V9.06104Z"
        fill="#5F4AFF"
      />
      <path
        d="M60.9654 13.7952H63.2217V18.5195H60.9654V13.7952Z"
        fill="#6746FF"
      />
      <path
        d="M60.9654 18.519H63.2217V23.2434H60.9654V18.519Z"
        fill="#6746FF"
      />
      <path
        d="M60.9911 23.2432H63.1953V27.9675H60.9911V23.2432Z"
        fill="#EC35FF"
      />
      <path
        d="M60.8997 32.7017H63.2734V37.426H60.8997V32.7017Z"
        fill="#FF67D0"
      />
      <path
        d="M67.6427 -0.387451H69.9512V4.3369H67.6427V-0.387451Z"
        fill="#6A57FF"
      />
      <path
        d="M67.6684 4.33691H69.9248V9.06126H67.6684V4.33691Z"
        fill="#634FFF"
      />
      <path
        d="M67.6684 9.06104H69.9248V13.7854H67.6684V9.06104Z"
        fill="#634FFF"
      />
      <path
        d="M67.656 13.7952H69.9385V18.5195H67.656V13.7952Z"
        fill="#8F4EFF"
      />
      <path d="M67.656 18.519H69.9385V23.2434H67.656V18.519Z" fill="#8F4EFF" />
      <path
        d="M67.656 23.2432H69.9385V27.9675H67.656V23.2432Z"
        fill="#B053FF"
      />
      <path
        d="M67.656 27.9768H69.9385V32.7012H67.656V27.9768Z"
        fill="#B053FF"
      />
      <path
        d="M67.6038 37.4258H69.9775V42.1501H67.6038V37.4258Z"
        fill="#FF65D0"
      />
      <path
        d="M74.3728 -0.387451H76.6553V4.3369H74.3728V-0.387451Z"
        fill="#6D52FF"
      />
      <path
        d="M74.3986 4.33691H76.6289V9.06126H74.3986V4.33691Z"
        fill="#5941FF"
      />
      <path
        d="M74.3986 9.06104H76.6289V13.7854H74.3986V9.06104Z"
        fill="#5941FF"
      />
      <path
        d="M74.347 13.7952H76.6816V18.5195H74.347V13.7952Z"
        fill="#8E5DFF"
      />
      <path d="M74.347 18.519H76.6816V23.2434H74.347V18.519Z" fill="#8E5DFF" />
      <path
        d="M74.268 23.2432H76.7461V27.9675H74.268V23.2432Z"
        fill="#E6C3FF"
      />
      <path
        d="M74.3986 32.7017H76.6289V37.426H74.3986V32.7017Z"
        fill="#9D42FF"
      />
      <path
        d="M81.1285 -0.387451H83.3066V4.3369H81.1285V-0.387451Z"
        fill="#5331FF"
      />
      <path
        d="M81.0894 4.33691H83.3457V9.06126H81.0894V4.33691Z"
        fill="#6B4DFF"
      />
      <path
        d="M81.0894 9.06104H83.3457V13.7854H81.0894V9.06104Z"
        fill="#6B4DFF"
      />
      <path
        d="M81.1027 13.7952H83.333V18.5195H81.1027V13.7952Z"
        fill="#853FFF"
      />
      <path d="M81.1027 18.519H83.333V23.2434H81.1027V18.519Z" fill="#853FFF" />
      <path
        d="M81.0769 23.2432H83.3594V27.9675H81.0769V23.2432Z"
        fill="#A953FF"
      />
      <path
        d="M81.0769 27.9768H83.3594V32.7012H81.0769V27.9768Z"
        fill="#A953FF"
      />
      <path
        d="M81.1285 32.7017H83.3066V37.426H81.1285V32.7017Z"
        fill="#DF21FF"
      />
      <path
        d="M81.0635 37.4258H83.3721V42.1501H81.0635V37.4258Z"
        fill="#D354FF"
      />
      <path
        d="M87.7676 -0.387451H90.0762V4.3369H87.7676V-0.387451Z"
        fill="#765CFF"
      />
      <path
        d="M87.8202 4.33691H90.0244V9.06126H87.8202V4.33691Z"
        fill="#6A3CFF"
      />
      <path
        d="M87.8202 9.06104H90.0244V13.7854H87.8202V9.06104Z"
        fill="#6A3CFF"
      />
      <path
        d="M87.8068 13.7952H90.0371V18.5195H87.8068V13.7952Z"
        fill="#6B48FF"
      />
      <path
        d="M87.8068 18.519H90.0371V23.2434H87.8068V18.519Z"
        fill="#6B48FF"
      />
      <path
        d="M87.6762 23.2432H90.1543V27.9675H87.6762V23.2432Z"
        fill="#CD78FF"
      />
      <path
        d="M87.6762 27.9768H90.1543V32.7012H87.6762V27.9768Z"
        fill="#CD78FF"
      />
      <path
        d="M87.8202 32.7017H90.0244V37.426H87.8202V32.7017Z"
        fill="#B535FF"
      />
      <path
        d="M87.8202 42.1497H90.0244V46.874H87.8202V42.1497Z"
        fill="#A135FF"
      />
      <path
        d="M94.4978 -0.387451H96.7803V4.3369H94.4978V-0.387451Z"
        fill="#7451FF"
      />
      <path
        d="M94.5494 4.33691H96.7275V9.06126H94.5494V4.33691Z"
        fill="#5B28FF"
      />
      <path
        d="M94.5494 9.06104H96.7275V13.7854H94.5494V9.06104Z"
        fill="#5B28FF"
      />
      <path
        d="M94.537 13.7952H96.7412V18.5195H94.537V13.7952Z"
        fill="#6F39FF"
      />
      <path d="M94.537 18.519H96.7412V23.2434H94.537V18.519Z" fill="#6F39FF" />
      <path
        d="M94.537 23.2432H96.7412V27.9675H94.537V23.2432Z"
        fill="#9736FF"
      />
      <path
        d="M94.537 27.9768H96.7412V32.7012H94.537V27.9768Z"
        fill="#9736FF"
      />
      <path
        d="M94.5494 37.4258H96.7275V42.1501H94.5494V37.4258Z"
        fill="#8D2BFF"
      />
      <path
        d="M94.393 46.8838H96.8711V51.6081H94.393V46.8838Z"
        fill="#E87CFF"
      />
    </g>
  </svg>
);
