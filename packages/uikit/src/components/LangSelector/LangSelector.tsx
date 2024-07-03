import React from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import LanguageIcon from "../Svg/Icons/Language";
import MenuButton from "./MenuButton";
import { Colors } from "../../theme";
import { Language } from "./types";
import { Position } from "../Dropdown/types";
import { Scale } from "../Button/types";
import { useMatchBreakpoints } from "../../hooks";

interface Props {
  currentLang: string;
  langs: Language[];
  setLang: (lang: Language) => void;
  color: keyof Colors;
  dropdownPosition?: Position;
  buttonScale?: Scale;
  hideLanguage?: boolean;
}

const MoblieButton = styled(Button)`
  ${({ isMobile }) => isMobile && `padding-left: 0;`}
`

const LangSelector: React.FC<React.PropsWithChildren<Props>> = ({
  currentLang,
  langs,
  color,
  setLang,
  dropdownPosition = "bottom",
  buttonScale = "md",
  hideLanguage = false,
}) => {
  const { isMobile } = useMatchBreakpoints();

  return (
    <Dropdown
      position={dropdownPosition}
      target={
        <MoblieButton isMobile={isMobile} scale={buttonScale} variant="text" startIcon={<LanguageIcon color={color} width="20px" />}>
          {!hideLanguage && <Text color={color}>{currentLang?.toUpperCase()}</Text>}
        </MoblieButton>
      }
    >
      {langs.map((lang) => (
        <MenuButton
          key={lang.locale}
          fullWidth
          onClick={() => setLang(lang)}
          // Safari fix
          style={{ minHeight: "32px", height: "auto" }}
        >
          {lang.language}
        </MenuButton>
      ))}
    </Dropdown>
  )
};
export default React.memo(
  LangSelector,
  (prevProps, nextProps) => (
    prevProps.currentLang === nextProps.currentLang &&
    prevProps.dropdownPosition === nextProps.dropdownPosition
  )
);