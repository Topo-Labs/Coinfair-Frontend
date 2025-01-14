import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";
import { IoWarning } from "react-icons/io5";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <div style={{ color: '#ffb700' }}>
      <IoWarning size={22} {...props}/>
    </div>
  );
};

export default Icon;
