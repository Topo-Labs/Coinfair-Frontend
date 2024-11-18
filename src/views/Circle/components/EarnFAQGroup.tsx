import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization';
import { EarnAnswer, EarnFAQItem, EarnQuestion, EarnAnswerWrapper, PlusMinusIcon } from './styles'

type EarnFAQGroupProps = {
  question: string;
  answer: string;
  faqItem: any;
  isOpen: boolean;
  toggleOpen: (index: number) => void;
  index: number;
};

export default function EarnFAQGroup({ question, answer, faqItem, isOpen, toggleOpen, index }: EarnFAQGroupProps): JSX.Element {

  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const { t } =  useTranslation()

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
        Q: {t(question)}
        <PlusMinusIcon isOpen={isOpen}/>
      </EarnQuestion>
      <EarnAnswerWrapper isOpen={isOpen} height={height}>
        <EarnAnswer ref={answerRef}>A: {t(answer)}<br/>{t(faqItem?.seconds ? faqItem?.seconds : '')}</EarnAnswer>
      </EarnAnswerWrapper>
    </EarnFAQItem>
  )
}