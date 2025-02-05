import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/images/logo/logoText.svg" style={{ minWidth: "128px", height: "28px" }} alt="" {...props} />;
};

export default Icon;