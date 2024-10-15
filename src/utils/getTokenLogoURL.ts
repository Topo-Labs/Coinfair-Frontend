const getTokenLogoURL = (address: string) => {
  return `https://github.com/Topo-Labs/CoinfairTokenList/blob/main/${address}.png?raw=true`
  /* return `https://github.com/PeopleEquity/TokenList/blob/main/lists/images/${address}.png?raw=true` */
}

export default getTokenLogoURL
