import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M8.6 4H3L9.60869 12.8116L3.35996 19.9999H5.47998L10.5906 14.1208L15 20H20.6L13.7134 10.8178L19.6401 4H17.5201L12.7314 9.50862L8.6 4ZM15.8 18.4L6.2 5.6H7.8L17.4 18.4H15.8Z"/>
    </Svg>
  );
};

export default Icon;
