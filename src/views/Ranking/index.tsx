import styled from 'styled-components'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Card, useMatchBreakpointsContext, useOnClickOutside, useTooltip } from '@pancakeswap/uikit'
import Page from '../Page'
import WealthList from './components/WealthList'
import CurrenciesList from './components/CurrenciesList'

const RankPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ReferenceElement = styled.div`
  position: absolute;
  // display: inline-block;
  top: 70%;
  z-index: 1000;
  right: 0px;
`

const StyledAppBody = styled(Card)`
  border: none;
  border-radius: 6px;
  overflow: unset;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  max-width: 687px;
  width: 100%;
  z-index: 1;
  // background: #f9f9fa;
  text-align: center;
  & > div {
    background: transparent;
  }
  @media screen and (max-width: 852px) {
    // background: #fff;
  }
`

const RankMenu = styled.div`
  display: flex;
  justify-content: center;
`

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`
const MenuContainer = styled.div`
  width: 100%;
  background: #fff;
  margin: 0 auto;
  padding: 15px 0;
  /* padding-top: 10px; */
`
const MenuItem = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  cursor: pointer;
  // color: #333;
  flex: 1;
  display: flex;
  justify-content: center;
  white-space: pre;
  &.left {
    justify-content: left;
  }
  &.right {
    justify-content: right;
  }
  &.active {
    color: #000;
  }
  @media screen and (max-width: 852px) {
    font-size: 14px;
    padding: 0 10px;
  }
`

const RankBody = styled.div`
  background: #fff;
  border-radius: 16px;
`

const TopBar = styled.div`
  margin: 14px 0;
  display: flex;
  justify-content: center;
`

const FilterBox = styled.div`
  background: #fff;
  display: flex;
  padding-left: 50px;
  padding-right: 20px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`

const SubTab = styled.div`
  width: 360px;
  height: 36px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  // background: #f4f5f8;
  padding: 2px;
  display: flex;
  justify-content: space-between;
  & > span {
    max-width: 50%;
    height: 100%;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 32px;
    // color: #15141F;
    text-align: center;
    display: block;
    border-radius: 6px;
    flex: 1;
    cursor: pointer;
    &.active {
      color: #000;
      font-weight: 600;
      background: #fff;
    }
  }
  @media screen and (max-width: 852px) {
    width: 100%;
  }
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #f4f5f8;
  margin: 12px 0;
`

const FilterTime = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: -0.02em;
  // color: #52525c;
`

const FilterTimeWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  & > span {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    background-image: url('/images/dcs/arrow.png');
    display: block;
    background-size: 16px;
    background-repeat: no-repeat;
    transition: all 0.4s; 
    &.active {
      transform: rotate(180deg);
    }
  }
`

const TimeMenu = styled.div`
  width: 86px;
  padding: 6px 0px;
  position: absolute;
  right: 0px;
  top: 32px;
  // background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 100;
`

const TimeMenuItem = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  text-align: left;
  // color: #15141f;
  cursor: pointer;
  :hover {
    // background: #f3f4f9;
    color: #000;
  }
`

const HelpBtn = styled.img`
   width: 60px;
`
export default function Ranking() {

  const { t, currentLanguage } = useTranslation()
  const [listType, setListType] = useState<'Wealth' | 'Trending' | 'Currencies'>('Wealth')
  const [type, setType] = useState<'income' | 'people' | 'recommend' | 'team' | ''>('recommend')
  const [visible, setVisible] = useState(false)
  const [isShowMenu, setIsShowMenu] = useState(true)
  const { isDesktop } = useMatchBreakpointsContext()
  const [helpContent, setHelpContent] = useState("");

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    helpContent,
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, setVisible ? () => setVisible(false) : undefined)

  const timeList = useMemo(() => {
    return [
      {
        key: 'month',
        value: t('dcsmonth')
      },
      {
        key: 'quarter',
        value: t('dcs3months')
      },
      {
        key: 'halfYear',
        value: t('dcs6months')
      },
      {
        key: 'Year',
        value: t('dcsyear')
      },
      {
        key: 'history',
        value: t('dcsAll')
      }
    ]
  }, [t])

  const [timeType, setTimeType] = useState(timeList[0])

  useEffect(() => {
    setTimeType(timeList.find((item) => (item.key === timeType.key)))
  }, [currentLanguage.language])

  useEffect(() => {
    switch (type) {
      case "recommend": {
        setHelpContent(t('Profitability of all members'))
        break;
      }
      case "team": {
        setHelpContent(t('excluding community leader'))
        break;
      }
      case "income": {
        setHelpContent(t('received by individuals'))
        break;
      }
      case "people": {
        setHelpContent(t('users brought to each project'))
        break;
      }
      case "": {
        setHelpContent(t('brought to the project'))
        break;
      }
      default: {
        setHelpContent(t('Profitability of all members'))
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, currentLanguage.language])

  const List = useMemo(() => {
    switch (listType) {
      case "Wealth": {
        return <WealthList
          timeType={timeType}
          type={type}
          pageName="wealth"
        />
      }
      case "Trending": {
        return <WealthList
          timeType={timeType}
          type={type}
          pageName="trending"
        />
      }
      case "Currencies": {
        return <CurrenciesList
          type={type}
          setIsShowMenu={setIsShowMenu}
        />
      }
      default: {
        return <WealthList
          timeType={timeType}
          type={type}
          pageName="wealth"
        />
      }
    }
  }, [listType, type, timeType])

  const menu = useMemo(() => {
    return (
      <TimeMenu>
        {
          timeList.map((item) => (
            <TimeMenuItem key={item.key} onClick={() => {
              setTimeType(item)
              setVisible(false)
            }}>{item.value}</TimeMenuItem>
          ))
        }
      </TimeMenu>
    )
  }, [timeList])

  const subTab = useMemo(() => {
    if (listType === 'Wealth') {
      return (
        <>
          <span
            role="button"
            tabIndex={0}
            className={type === 'recommend' ? 'active' : ''}
            onClick={() => {
              setType('recommend')
            }}
            onKeyDown={() => {
              setType('recommend')
            }}
          >{t('dcsTotalEarnings')}</span>
          <span
            role="button"
            tabIndex={0}
            className={type === 'team' ? 'active' : ''}
            onClick={() => {
              setType('team')
            }}
            onKeyDown={() => {
              setType('team')
            }}
          >{t('dcsCommunityEarnings')}</span>
        </>
      )
    }
    return (
      <>
        <span
          role="button"
          tabIndex={0}
          className={type === 'income' ? 'active' : ''}
          onClick={() => {
            setType('income')
          }}
          onKeyDown={() => {
            setType('income')
          }}
        >{t('dcsKOLEarnings')}</span>
        <span
          role="button"
          tabIndex={0}
          className={type === 'people' ? 'active' : ''}
          onClick={() => {
            setType('people')
          }}
          onKeyDown={() => {
            setType('people')
          }}
        >{t('dcsCreditLinks')}</span>
      </>
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listType, type, setType, currentLanguage])

  return (
    <RankPage>
      {
        isDesktop ?
          <>
            <MenuContainer>
              <RankMenu>
                <MenuItem className={listType === 'Wealth' ? 'active left' : 'left'}
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    flex: 0,
                    marginRight: '20px',
                    marginLeft: '20px'
                  }}
                  onClick={() => {
                  setListType('Wealth')
                  setType('recommend')
                  setTimeType(timeList[0])
                }}>{t('dcsEarnings')}</MenuItem>
                <MenuItem className={listType === 'Trending' ? 'active' : ''}
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    flex: 0,
                    marginRight: '20px',
                    marginLeft: '20px'
                  }}
                  onClick={() => {
                  setListType('Trending')
                  setType('income')
                  setTimeType(timeList[0])
                }}>{t('dcsTrendingKOL')}</MenuItem>
                <MenuItem className={listType === 'Currencies' ? 'active right' : 'right'}
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    flex: 0,
                    marginRight: '20px',
                    marginLeft: '20px'
                  }}
                  onClick={() => {
                  setListType('Currencies')
                  setType('')
                  setTimeType(timeList[0])
                }}>{t('dcsToken')}</MenuItem>
              </RankMenu>
            </MenuContainer>
            {
              listType !== 'Currencies' ?
                <TopBar>
                  <SubTab>
                    {subTab}
                  </SubTab>
                  <FilterBox>
                    <FilterTimeWrapper ref={node as any} onClick={(e) => {
                      e.preventDefault()
                      setVisible(!visible);
                    }}>
                      <FilterTime>{timeType.value}</FilterTime>
                      <span className={visible ? 'active' : ''} />
                      {
                        visible ? menu : null
                      }
                    </FilterTimeWrapper>
                  </FilterBox>
                </TopBar> : null
            }
          </> :
          <>
            {
              isShowMenu ? 
              <RankBody>
                <TopBar>
                  <Menu>
                    <MenuItem className={listType === 'Wealth' ? 'active left' : 'left'} onClick={() => {
                      setListType('Wealth')
                      setType('recommend')
                    }}>{t('dcsEarnings')}</MenuItem>
                    <MenuItem className={listType === 'Trending' ? 'active' : ''} onClick={() => {
                      setListType('Trending')
                      setType('income')
                    }}>{t('dcsTrendingKOL')}</MenuItem>
                    <MenuItem className={listType === 'Currencies' ? 'active right' : 'right'} onClick={() => {
                      setListType('Currencies')
                      setType('')
                    }}>{t('dcsToken')}</MenuItem>
                  </Menu>
                  {
                    listType !== 'Currencies' ?
                      <FilterTimeWrapper onClick={(e) => {
                        e.preventDefault()
                        if (!visible) {
                          setVisible(true)
                        }
                      }}>
                        <FilterTime>{timeType.value}</FilterTime>
                        <span className={visible ? 'active' : ''} />
                        {
                          visible ? menu : null
                        }
                      </FilterTimeWrapper> : <div />
                  }
                </TopBar> 
              </RankBody>
              : null
            }
            {
              isShowMenu ? <Line /> : null
            }
            {
              listType !== 'Currencies' ?
                <SubTab>
                  {subTab}
                </SubTab> : null
            }
          </>
        }
      <StyledAppBody>
        {/* {
          isDesktop ?
            <>
              <MenuContainer>
                <Menu>
                  <MenuItem className={listType === 'Wealth' ? 'active left' : 'left'} onClick={() => {
                    setListType('Wealth')
                    setType('recommend')
                    setTimeType(timeList[0])
                  }}>{t('dcsEarnings')}</MenuItem>
                  <MenuItem className={listType === 'Trending' ? 'active' : ''} onClick={() => {
                    setListType('Trending')
                    setType('income')
                    setTimeType(timeList[0])
                  }}>{t('dcsTrendingKOL')}</MenuItem>
                  <MenuItem className={listType === 'Currencies' ? 'active right' : 'right'} onClick={() => {
                    setListType('Currencies')
                    setType('')
                    setTimeType(timeList[0])
                  }}>{t('dcsToken')}</MenuItem>
                </Menu>
              </MenuContainer>
              {
                listType !== 'Currencies' ?
                  <TopBar>
                    <SubTab>
                      {subTab}
                    </SubTab>
                    <FilterTimeWrapper ref={node as any} onClick={(e) => {
                      e.preventDefault()
                      setVisible(!visible);
                    }}>
                      <FilterTime>{timeType.value}</FilterTime>
                      <span className={visible ? 'active' : ''} />
                      {
                        visible ? menu : null
                      }
                    </FilterTimeWrapper>
                  </TopBar> : null
              }
            </> :
            <>
              {
                isShowMenu ? <TopBar>
                  <Menu>
                    <MenuItem className={listType === 'Wealth' ? 'active left' : 'left'} onClick={() => {
                      setListType('Wealth')
                      setType('recommend')
                    }}>{t('dcsEarnings')}</MenuItem>
                    <MenuItem className={listType === 'Trending' ? 'active' : ''} onClick={() => {
                      setListType('Trending')
                      setType('income')
                    }}>{t('dcsTrendingKOL')}</MenuItem>
                    <MenuItem className={listType === 'Currencies' ? 'active right' : 'right'} onClick={() => {
                      setListType('Currencies')
                      setType('')
                    }}>{t('dcsToken')}</MenuItem>
                  </Menu>
                  {
                    listType !== 'Currencies' ?
                      <FilterTimeWrapper onClick={(e) => {
                        e.preventDefault()
                        if (!visible) {
                          setVisible(true)
                        }
                      }}>
                        <FilterTime>{timeType.value}</FilterTime>
                        <span className={visible ? 'active' : ''} />
                        {
                          visible ? menu : null
                        }
                      </FilterTimeWrapper> : <div />
                  }
                </TopBar> : null
              }
              {
                isShowMenu ? <Line /> : null
              }
              {
                listType !== 'Currencies' ?
                  <SubTab>
                    {subTab}
                  </SubTab> : null
              }
            </>
        } */}
        {List}
      </StyledAppBody>
      <ReferenceElement ref={targetRef}>
        <HelpBtn src='/images/questionIcon.png' />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </RankPage >
  )
}
