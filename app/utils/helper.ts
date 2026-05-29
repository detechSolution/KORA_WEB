type CalculatePriceParams = {
  price: number;
  guests?: number;
  quantity?: number;
  promoDiscount?: number;
  membershipDiscount?: number;
};

export const calculatePrice = ({
  price,
  guests,
  quantity,
  promoDiscount = 0,
  membershipDiscount = 0,
}: CalculatePriceParams) => {
  const totalQuantity = guests || quantity || 1;

  const subtotal = price * totalQuantity;

  const totalDiscountPercentage = promoDiscount + membershipDiscount;

  const discountAmount = subtotal * (totalDiscountPercentage / 100);

  const finalPrice = subtotal - discountAmount;

  return {
    subtotal,
    totalDiscountPercentage,
    discountAmount,
    finalPrice,
  };
};
