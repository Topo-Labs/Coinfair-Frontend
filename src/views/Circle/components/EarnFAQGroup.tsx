import React, { useEffect, useRef, useState } from 'react'
import { EarnAnswer, EarnFAQItem, EarnQuestion, EarnAnswerWrapper, PlusMinusIcon } from './styles'

type EarnFAQGroupProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: (index: number) => void;
  index: number;
};

export default function EarnFAQGroup({ question, answer, isOpen, toggleOpen, index }: EarnFAQGroupProps): JSX.Element {

  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && answerRef.current) {
      setHeight(answerRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <EarnFAQItem>
      <EarnQuestion onClick={() => toggleOpen(index)}>
        Q: {question}
        <PlusMinusIcon isOpen={isOpen}/>
      </EarnQuestion>
      <EarnAnswerWrapper isOpen={isOpen} height={height}>
        <EarnAnswer ref={answerRef}>A: {answer}</EarnAnswer>
      </EarnAnswerWrapper>
    </EarnFAQItem>
  )
}