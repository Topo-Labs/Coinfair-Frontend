import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <img src="/images/okx-wallet.png" style={{width:'40px',height:'40px',padding:'4px'}} />
  );
};

export default Icon;
