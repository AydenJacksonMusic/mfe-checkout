import { LineItemField } from "@commercelayer/react-components"
import {
  LineItem,
  TLineItem,
} from "@commercelayer/react-components/line_items/LineItem"
import LineItemAmount from "@commercelayer/react-components/line_items/LineItemAmount"
import LineItemImage from "@commercelayer/react-components/line_items/LineItemImage"
import LineItemName from "@commercelayer/react-components/line_items/LineItemName"
import LineItemOption from "@commercelayer/react-components/line_items/LineItemOption"
import LineItemQuantity from "@commercelayer/react-components/line_items/LineItemQuantity"
import { useTranslation } from "next-i18next"
import React from "react"

import {
  LineItemDescription,
  LineItemQty,
  LineItemTitle,
  LineItemWrapper,
  StyledLineItemSkuCode,
  StyledLineItemOptions,
} from "./styled"

interface Props {
  type: TLineItem
}

const CODE_LOOKUP: { [k: string]: "sku_code" | "bundle_code" | undefined } = {
  skus: "sku_code",
  bundles: "bundle_code",
}

export const LineItemTypes: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation()
  return (
    <LineItem type={type}>
      <LineItemWrapper data-testid={`line-items-${type}`}>
        <LineItemImage
          width={85}
          className="self-start p-1 bg-white border rounded"
        />
        <LineItemDescription>
          <StyledLineItemSkuCode type={CODE_LOOKUP[type]} />
          <LineItemTitle>
            <LineItemName className="font-bold" />
            <LineItemAmount
              data-testid="line-item-amount"
              className="pl-2 text-lg font-extrabold"
            />
          </LineItemTitle>
          <StyledLineItemOptions showAll showName={true} className="options">
            <LineItemOption />
          </StyledLineItemOptions>
          <LineItemField attribute="frequency">
            {/*  @ts-expect-error typing on attribute */}
            {({ attributeValue }) =>
              attributeValue ? (
                <p className="text-sm text-gray-400">
                  {attributeValue[0].toUpperCase() + attributeValue.slice(1)}{" "}
                  subscription
                </p>
              ) : null
            }
          </LineItemField>
          <LineItemQty>
            <LineItemQuantity>
              {(props) => (
                <>
                  {!!props.quantity &&
                    t("orderRecap.quantity", { count: props.quantity })}
                </>
              )}
            </LineItemQuantity>
          </LineItemQty>
        </LineItemDescription>
      </LineItemWrapper>
    </LineItem>
  )
}
