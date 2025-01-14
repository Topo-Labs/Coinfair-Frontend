export const ammTypeValues = (ammType: number, tokenBIsBNB: boolean) => {
  const sequence = tokenBIsBNB ? 0 : 1;
  switch (ammType) {
    case 1:
      return 1

    case 2:
      return sequence === 0 ? 2 : 3

    case 3:
      return sequence === 0 ? 4 : 5
  
    default:
      return 1
  }
}