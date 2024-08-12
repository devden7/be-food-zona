export const calcRating = (arr): string => {
  if (arr === undefined || arr.length === 0) return '0';

  const calc = arr.reduce((acc: number, item) => acc + item.rating, 0);
  const convertCalc = (calc / arr.length).toString();
  let finalResult;
  const splitResult = convertCalc.split('.');
  if (splitResult.length === 1) {
    finalResult = splitResult[0];
    return finalResult;
  }
  const takeDecimal =
    splitResult[1].length > 1 ? splitResult[1].slice(0, 1) : '';
  finalResult = `${splitResult[0]}.${takeDecimal}`;
  return finalResult;
};
