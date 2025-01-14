// QuestionTip.tsx
import React from 'react';
import { GrCircleQuestion } from 'react-icons/gr';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';

interface QuestionTipProps {
  tooltipText: string;
  iconSize?: number;
  iconColor?: string;
}

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;
`;

const QuestionTip = ({ tooltipText, iconSize = 16, iconColor = '#000' }) => {
  // 生成一个唯一的 ID 以确保多个 QuestionTip 不会冲突
  const tooltipId = `question-tip-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <IconWrapper>
      <GrCircleQuestion
        data-tip
        data-for={tooltipId}
        size={iconSize}
        color={iconColor}
      />
      <Tooltip id={tooltipId} place="right-start">
        {tooltipText}
      </Tooltip>
    </IconWrapper>
  );
};

export default QuestionTip;
