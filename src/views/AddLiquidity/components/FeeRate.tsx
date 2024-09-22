import React, { useState, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'

interface FeeTypesIF {
    show: number | string;
    real: number | string;
}

const FeeRateContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const FeeRateItem = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    // border: 1px solid #ccc;
    border-radius: 20px;
    margin-right: 5px;
    cursor: pointer;
    background: #eee;
    position: relative;
    overflow: hidden;
    transition: all .3s ease;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -150%;
        width: 150%;
        height: 100%;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(107, 134, 255, 0) 100%);
        border-radius: 20px;
        transition: left 0.3s ease-in-out;
    }
    &:hover::before {
        animation: light-flash 1.5s ease-in-out;
    }
    &:hover {
        border-color: rgb(66, 99, 235);
    }
    @keyframes light-flash {
        0% {
            left: -150%;
        }
        50% {
            left: 100%;
        }
        100% {
            left: 100%;
        }
    }
`;

const feeTypes: FeeTypesIF[] = [
    {
        show: '0.30',
        real: 3,
    },
    {
        show: '0.50',
        real: 5,
    },
    {
        show: '1.00',
        real: 1,
    }
]

const FeeRate: React.FC<React.PropsWithChildren<Props>> = ({ feeType, setFeeType }) => {

    return (
        <FeeRateContainer>
            {
                feeTypes.map(current => 
                    <FeeRateItem 
                        style={{ 
                            background: current.real === feeType ? 'rgb(0, 0, 0)' : '#eee',
                            color: current.real === feeType ? '#fff' : '#000',
                            borderColor: current.real === feeType ? 'transparent' : '#ccc'
                        }}
                        onClick={() => setFeeType(current.real)}
                    >{current.show}%</FeeRateItem>
                )
            }
        </FeeRateContainer>
    )
}

export default FeeRate