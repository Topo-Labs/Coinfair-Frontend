import React, { useState } from 'react';
import { Card, CardButton, CardContent, CardDescription, CardTitle } from './styles'
import { SwapSvg } from 'components/Svg/Points';

const HoverCard = () => (

  // const [strokeColor, setStrokeColor] = useState("black");

  <Card 
    // onMouseEnter={() => setStrokeColor("#fff")}
    // onMouseLeave={() => setStrokeColor("#000")}
  >
    <CardContent>
      <SwapSvg stroke={'#000'} />
      <CardTitle>参与SWAP交易</CardTitle>
      <CardDescription>参与swap交易，最高返还30%积分。</CardDescription>
      <CardButton>立即参与</CardButton>
    </CardContent>
  </Card>
);

export default HoverCard;
