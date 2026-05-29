type CalculatePriceParams = {
  price: number;
  guests?: number;
  quantity?: number;
  discount?: number;
  membershipDiscount?: number;
};

export const calculatePrice = ({
  price,
  guests,
  quantity,
  discount = 0,
}: CalculatePriceParams) => {
  const totalQuantity = guests || quantity || 1;

  const subtotal = price * totalQuantity;

  const discountAmount = subtotal * (discount / 100);

  const finalPrice = subtotal - discountAmount;

  return {
    subtotal,
    discountAmount,
    finalPrice,
  };
};
