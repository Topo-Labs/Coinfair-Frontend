import React, { useEffect, useState } from "react";
import { LogoWithTextIcon, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import styled from "styled-components";
import { darkColors } from "../../theme/colors";
import { Flex } from "../Box";
import { StyledFooter, StyledIconMobileContainer, StyledSocialLinks, StyledToolsContainer } from "./styles";
import { FooterProps } from "./types";
import { ThemeSwitcher } from "../ThemeSwitcher";
import LangSelector from "../LangSelector/LangSelector";
import { Colors } from "../..";
import { Position } from "../Dropdown/types"
import LogoWithText from "../Svg/Icons/LogoWithText";

const ListTitle = styled.div`
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 800;
    font-size: 14px;
    line-height: 140%;
    display: flex;
    align-items: center;
    color: #000;
  `


const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints();
  const [position1, setPosition1] = useState<Position>("top-left")

  useEffect(() => {
    if (isMobile) {
      setPosition1("top-right")
    } else {
      setPosition1("top-left")
    }
  }, [isMobile])

  return (
    <StyledFooter p={isMobile ? ["25px 16px", null] : ["25px 16px 10px 16px", null]} {...props} justifyContent="center">
      <Flex flexDirection="column" justifyContent='center' width={["100%", null, "1200px;"]}>
        {/* <StyledIconMobileContainer display={["block", null, "none"]}>
            <LogoWithTextIcon />
          </StyledIconMobileContainer> */}
        {/* <Flex
            order={[2, null, 1]}
            flexDirection={["column", null, "row"]}
            justifyContent="space-between"
            alignItems="flex-start"
            mb={["42px", null, "36px"]}
          >
            {items?.map((item) => (
              <StyledList key={item.label}>
                <StyledListItem>{item.label}</StyledListItem>
                {item.items?.map(({ label, href, isHighlighted = false }) => (
                  <StyledListItem key={label}>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        color={isHighlighted ? baseColors.warning : darkColors.text}
                        bold={false}
                      >
                        {label}
                      </Link>
                    ) : (
                      <StyledText>{label}</StyledText>
                    )}
                  </StyledListItem>
                ))}
              </StyledList>
            ))}
            <Box display={["none", null, "block"]}>
              <LogoWithTextIcon isDark width="160px" />
            </Box>
          </Flex> */}
        <StyledSocialLinks order={isMobile ? [0] : [2]} pb={["42px", null, "32px"]} mb={['0', null, "32px"]} />
        <StyledToolsContainer
          order={isMobile ? [0] : [1, null, 3]}
          flexDirection={["column", null, "row"]}
          justifyContent="center"
          alignItems={isMobile ? 'center' : 'none'}
          width='100%'
          style={{ paddingBottom: 0, marginBottom: 0 }}
        >
          {/* <Flex order={[2, null, 1]} alignItems="center"> */}
            {/* <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} /> */}
            {/* <LangSelector
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color={darkColors.textSubtle as keyof Colors}
              dropdownPosition={position1}
            /> */}
          {/* </Flex> */}
          <Flex style={{ marginTop: '-50px' }} alignItems="center">
            <ListTitle color="light">© 2024 Coinfair. All Rights Reserved.</ListTitle>
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
