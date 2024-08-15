import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { useWeb3React } from '@web3-react/core';
import useENSName from "../../../../../../../src/hooks/useENSName"
import useGoogleAnalysis from "../../../../../../../src/hooks/useGoogleAnalysis"
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import MenuIcon from "./MenuIcon";
import { UserMenuItem } from "./styles";

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  background-color: #e9e9e9;
  border-radius: 16px;
  // box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  padding-left: 24px;
  padding-right: 4px;
  position: relative;
  transition: opacity .3s;
  &:hover {
    opacity: 0.6;
  }
`;

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: none;
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: 8px;
    // margin-right: 4px;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  // border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  width: 280px;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  ellipsis = true,
  variant = variants.DEFAULT,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const [bnbName, setBnbName] = useState<string | null>(null);
  const { chainId } = useWeb3React()
  const nameService = useENSName(account ? [account] : []);

  useGoogleAnalysis(account, { "account": account?.toString() }, account ? account.startsWith("0x") : false)
  useEffect(() => {
    const nonEmptyNameObjects = nameService.filter((item: { name: any; }) => item.name);
    console.info("fliter null name service:\n", nonEmptyNameObjects)
    setBnbName(nonEmptyNameObjects.length > 0 ? nonEmptyNameObjects[0].name : null);
  }, [nameService]);

  const accountEllipsis = account
    ? !bnbName ?
      ellipsis
        ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}`
        : account
      : null : null;

  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };
    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        onTouchStart={() => {
          setIsOpen((s) => !s);
        }}
      >
        <MenuIcon avatarSrc={avatarSrc} variant={variant} />
        <LabelText title={bnbName || text || account}>
          {bnbName || text || accountEllipsis}
        </LabelText>
        <ChevronDownIcon color="text" width="18px" />
      </StyledUserMenu>
      <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
        <Box onClick={() => setIsOpen(false)}> {children?.({ isOpen })}</Box>
      </Menu>
    </Flex>
  );
};

export default UserMenu;
