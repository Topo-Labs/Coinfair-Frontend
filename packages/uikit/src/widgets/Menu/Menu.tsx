// Menu.js
import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import Footer from "../../components/Footer";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../hooks";
import Logo from "./components/Logo";
import Vanta from './components/Vanta'; // 引入 Sketch 组件作为背景
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { NavProps } from "./types";
import LangSelector from "../../components/LangSelector/LangSelector";
import { MenuContext } from "./context";
import { useMatchBreakpointsContext } from "../../contexts";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1; /* 确保内容在 Vanta 之上 */
`;

// VantaWrapper 包裹 Vanta 组件，使其作为全局背景
const VantaWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* 确保背景在最底层 */
  overflow: hidden;
  pointer-events: none; /* 禁用鼠标事件，防止影响交互 */
`;

const StyledNav = styled.nav`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.nav.background};
  box-shadow: 2px 2px 10px #eeeeee;
  transform: translate3d(0, 0, 0);
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  z-index: 2; /* 使导航在 Vanta 之上 */
`;

const HeaderNav = styled.div`
  width: fit-content;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 2; /* 保证显示在 Vanta 上方 */
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 2; /* 保持顶部横幅显示在其他内容之上 */
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  margin-top: 56px;
  flex: 1;
  z-index: 2;
`;

const StyledWrapper = styled.div`
  height: 56px;
  width: 100%;
  z-index: 2;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  rightSide,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  children,
}) => {
  const [showMenu, setShowMenu] = useState(true);
  const { isDesktop } = useMatchBreakpointsContext();
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = !isDesktop ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;
  const totalTopMenuHeight = banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      if (isTopOfPage) {
        setShowMenu(true);
      } else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          setShowMenu(true);
        } else {
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  const homeLink = links.find((link) => link.label === "Home");

  const subLinksWithoutMobile = subLinks?.filter((subLink) => {
    if (subLink.label !== 'Rank' && subLink.label !== 'Circle') return !subLink.isMobileOnly;
  });

  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      {/* 背景 Vanta 组件 */}
      {/* <Vanta /> */}
      <Wrapper>
        <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
          {banner && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>}
          <StyledNav>
            <Flex>
              <Logo isDark={isDark} href={homeLink?.href ?? "/"} />
            </Flex>
            <HeaderNav>
              <Flex>
                {isDesktop ? (
                  <SubMenuItems style={{ marginTop: 8 }} items={subLinksWithoutMobile} activeItem={activeSubItem} />
                ) : null}
              </Flex>
            </HeaderNav>
            <Flex alignItems="center" justifyContent={"center"} height="100%">
              <Box>
                <LangSelector
                  currentLang={currentLang}
                  langs={langs}
                  setLang={setLang}
                  buttonScale="xs"
                  color="textSubtle"
                  hideLanguage
                />
              </Box>
              {rightSide}
            </Flex>
          </StyledNav>
        </FixedContainer>

        {!isDesktop ? (
          <>
            {subLinks && (
              <Flex style={{ zIndex: 2 }} justifyContent="space-around">
                <SubMenuItems
                  items={subLinksWithoutMobile}
                  mt={`${totalTopMenuHeight + 1}px`}
                  activeItem={activeSubItem}
                />
                {subLinksMobileOnly?.length > 0 && (
                  <SubMenuItems
                    items={subLinksMobileOnly}
                    mt={`${totalTopMenuHeight + 1}px`}
                    activeItem={activeSubItem}
                    isMobileOnly
                  />
                )}
              </Flex>
            )}
          </>
        ) : (
          <StyledWrapper />
        )}

        <BodyWrapper mt={!subLinks ? `${totalTopMenuHeight + 1}px` : "0"}>
          <Inner isPushed={false} showMenu={showMenu}>
            {children}
          </Inner>
          <Footer
              items={footerLinks}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              cakePriceUsd={cakePriceUsd}
              buyCakeLabel={buyCakeLabel}
              mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
            />
        </BodyWrapper>
      </Wrapper>
    </MenuContext.Provider>
  );
};

export default Menu;
