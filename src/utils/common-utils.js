export const isValidUSD = (amount) => {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(amount) && parseFloat(amount) > 0;
};

export const formatUSD = (amount) => {
  const number = parseFloat(amount);
  if (isNaN(number)) {
    return '0.00';
  }
  return number.toFixed(2);
};