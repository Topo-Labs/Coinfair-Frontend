import React from 'react';


const NumberFormat = ({ value }:{value:string|number}) => {
    if (Number(value) < 0.0001) {
        const numArr = `${value}`.split('.');
        const index = numArr[1].split('').findIndex(v=>Number(v)>0);
        return <span title={`${value}`}>0.0<small style={{fontSize:'10px'}}>{index}</small>{numArr[1].replace(/^0+/, '')}</span>;
      }
      return <span>{value}</span>;
    
};

export default NumberFormat;