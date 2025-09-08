// Utility helpers for offers formatting and safe HTML parsing

export function formatCurrency(value) {
  if (value == null || isNaN(Number(value))) return "";
  try {
    return Number(value).toLocaleString();
  } catch (e) {
    return String(value);
  }
}

export function deriveBadgeFromDeal({ deal_type, discount_type, discount, new_price }) {
  const lower = (deal_type || "").toLowerCase();
  if (lower === "free") return { primary: "FREE", secondary: "" };
  if (lower === "special_offer" || lower === "special-offer") return { primary: "Special Offer", secondary: "" };
  if (lower === "price_cut" || lower === "price-cut") {
    const marked = new_price ? `$${formatCurrency(new_price)}` : "";
    return { primary: marked, secondary: "" };
  }
  if (lower === "discount") {
    if ((discount_type || "").toLowerCase() === "percentage") {
      return { primary: `${discount ?? 0}%`, secondary: "OFF" };
    }
    const amt = discount ? `$${formatCurrency(discount)}` : "";
    return { primary: amt, secondary: "OFF" };
  }
  return { primary: deal_type || "", secondary: "" };
}

export function deriveEstimatedValueLabel({ estimated_value_type, estimated_value }) {
  const typeLower = (estimated_value_type || "").toLowerCase();
  if (!estimated_value) return { label: "", value: "" };
  if (typeLower === "fixed") return { label: "Offer Value", value: `$${formatCurrency(estimated_value)}` };
  if (typeLower === "up_to" || typeLower === "up to") return { label: "up to", value: `$${formatCurrency(estimated_value)}` };
  return { label: estimated_value_type || "", value: `$${formatCurrency(estimated_value)}` };
}

export function splitDescription(html) {
  if (!html) return { descriptionHtml: "", redeemHtml: "" };
  const parts = String(html).split(/<p><strong>Steps to Redeem:<\/strong><\/p>/);
  if (parts.length >= 2) {
    return { descriptionHtml: parts[0], redeemHtml: parts[1] };
  }
  return { descriptionHtml: html, redeemHtml: "" };
}

export function sanitizeHtml(html) {
  // For this embed, we trust the provided partner HTML. Keep minimal sanitization.
  return html || "";
}


