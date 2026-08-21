type CalculatePriceParams = {
  price: number;
  guests?: number;
  quantity?: number;
  discount?: number;
  membershipDiscount?: number;
};

export function calculatePrice({
  price,
  guests,
  quantity,
  discount = 0,
}: CalculatePriceParams) {
  const totalQuantity = guests || quantity || 1;

  const subtotal = price * totalQuantity;

  const discountAmount = subtotal * (discount / 100);
  const unitDiscountAmount = price * (discount / 100);

  const finalPrice = subtotal - discountAmount;

  const unitPrice = price;

  const unitPriceAfterDiscount = unitPrice - unitDiscountAmount;

  return {
    subtotal,
    discountAmount,
    finalPrice,
    unitPrice,
    unitPriceAfterDiscount,
  };
}

export function calculateDuration(startTime: string, endTime: string): string {
  const parseTime = (time: string): number => {
    const [hour = "0", minute = "0"] = time.split(":");

    return Number(hour) * 60 + Number(minute);
  };

  const start = parseTime(startTime);
  let end = parseTime(endTime);

  if (end < start) {
    end += 24 * 60;
  }

  const diff = end - start;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
  }

  return parts.join(" ") || "0 min";
}

export function getDisabledMessage(session: any) {
  if (session.isBooked) {
    return "You have already booked this session.";
  }

  return "";
}

export function getDisabledMessageForGuest(session: any) {
  const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");

  const hasMembership = !!userDetail?.membership?.membershipPlanId;

  if (!hasMembership) {
    return "You need a membership plan to book this session for guest.";
  }

  if (!session.isGuestBookable) {
    return "Membership plan reached maximum guest allowance.";
  }

  return "";
}

export function preventInvalidNumberInput(e: KeyboardEvent) {
  if (["e", "E", "+", "-", "."].includes(e.key)) {
    e.preventDefault();
  }
}

export function getProgressColor(type: string) {
  if (type === "event")
    return "emerald";
  if (type === "workshop")
    return "purple";
  if (type === "class")
    return "blue";
  return "stone";
}

export function getBorderClass(type: string) {
  if (type === "event")
    return "border-emerald-800";
  if (type === "workshop")
    return "border-purple-800";
  if (type === "class")
    return "border-blue-800";
  return "border-stone-300 dark:border-stone-800";
}

export function getCardClass(type: string) {
  if (type === "event")
    return "bg-[#006045]/15 hover:bg-[#006045]/35";
  if (type === "workshop")
    return "bg-[#6E11B0]/15 hover:bg-[#6E11B0]/35";
  if (type === "class")
    return "bg-[#193CB8]/15 hover:bg-[#193CB8]/35";
  return "bg-[#151515] hover:bg-[#1C1C1C]";
}

export function getBadgeClass(type: string) {
  if (type === "event")
    return "bg-emerald-800 dark:bg-[#1B3B36] text-white dark:text-[#6EE7B7]";
  if (type === "workshop")
    return "bg-purple-800 dark:bg-[#3D1E62] text-white dark:text-[#D8B4FE]";
  if (type === "class")
    return "bg-blue-800 dark:bg-[#1E3A8A] text-white dark:text-[#93C5FD]";
  return "bg-stone-800 text-white dark:text-stone-300";
}
