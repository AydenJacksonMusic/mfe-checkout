import classNames from "classnames"
import { ReactNode, useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"

interface Props {
  index: number
  header: ReactNode
}

export const Accordion: React.FC = ({ children }) => {
  // const { isMobile } = useDeviceDetect()
  // return isMobile ? <Wrapper>{children}</Wrapper> : <>{children}</>
  return <Wrapper>{children}</Wrapper>
}

export const AccordionItem: React.FC<Props> = ({ children, index, header }) => {
  const ctx = useContext(AccordionContext)
  const appCtx = useContext(AppContext)

  if (!ctx || !appCtx) return null

  const handleSelection = () => {
    if (ctx.status !== "disabled") {
      return ctx.isActive ? appCtx.refetchOrder() : ctx.setStep()
    }
  }

  return (
    <AccordionTab
      tabIndex={index}
      className={classNames("group", {
        active: ctx.isActive,
        disabled: ctx.status === "disabled",
      })}
    >
      <AccordionTabHeader className="group" onClick={handleSelection}>
        <AccordionTitle>{header}</AccordionTitle>
        <AccordionIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </AccordionIcon>
      </AccordionTabHeader>
      <AccordionBody>{children}</AccordionBody>
    </AccordionTab>
  )
}

const Wrapper = styled.div`
  ${tw`-mx-5 md:-mx-0`}
`
const AccordionTab = styled.div`
  ${tw`outline-none bg-white shadow-bottom mb-2 px-5 md:px-0 md:mb-0 md:shadow-none md:border-b`}

  &:last-of-type {
    ${tw`mb-5`}
  }
`
const AccordionTabHeader = styled.div`
  ${tw`relative flex items-start justify-between pb-3 pt-5 cursor-pointer transition ease duration-500 focus:bg-gray-500 md:pt-6 md:pb-0`}
  .disabled & {
    ${tw`pointer-events-none`}
  }
`
const AccordionTitle = styled.div`
  ${tw`transition ease duration-500`}
`
const AccordionIcon = styled.div`
  ${tw`transform transition ease duration-500`}
  .active & {
    ${tw`-rotate-180 text-gray-400`}
  }
`
const AccordionBody = styled.div`
  ${tw`max-h-0 transition duration-300 ease-in opacity-0 lg:ml-8`}
  .active & {
    ${tw`max-h-full opacity-100`}
  }

  .disabled & {
    ${tw`max-h-0 opacity-0`}
  }
`
