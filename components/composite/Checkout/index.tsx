import CustomerContainer from "@commercelayer/react-components/customers/CustomerContainer"
import OrderContainer from "@commercelayer/react-components/orders/OrderContainer"
import PlaceOrderContainer from "@commercelayer/react-components/orders/PlaceOrderContainer"
import { useRouter } from "next/router"
import { useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { CheckoutSkeleton } from "components/composite/CheckoutSkeleton"
import { MainHeader } from "components/composite/MainHeader"
import { OrderSummary } from "components/composite/OrderSummary"
import { StepComplete } from "components/composite/StepComplete"
import {
  StepCustomer,
  StepHeaderCustomer,
} from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import {
  StepPayment,
  StepHeaderPayment,
} from "components/composite/StepPayment"
import { PaymentContainer } from "components/composite/StepPayment/PaymentContainer"
import StepPlaceOrder from "components/composite/StepPlaceOrder"
import {
  StepShipping,
  StepHeaderShipping,
} from "components/composite/StepShipping"
import { AccordionProvider } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Accordion, AccordionItem } from "components/ui/Accordion"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"

interface Props {
  logoUrl?: string
  orderNumber: number
  companyName: string
  supportEmail?: string
  supportPhone?: string
  termsUrl?: string
  privacyUrl?: string
}

const Checkout: React.FC<Props> = ({
  logoUrl,
  orderNumber,
  companyName,
  supportEmail,
  supportPhone,
  termsUrl,
  privacyUrl,
}) => {
  const ctx = useContext(AppContext)

  const { query } = useRouter()

  let paypalPayerId = ""
  let checkoutComSession = ""
  let redirectResult = ""
  let redirectStatus = ""

  if (query.PayerID) {
    paypalPayerId = query.PayerID as string
  }

  if (query.redirectResult) {
    redirectResult = query.redirectResult as string
  }

  if (query["cko-session-id"]) {
    checkoutComSession = query["cko-session-id"] as string
  }

  if (query.redirect_status) {
    redirectStatus = query.redirect_status as string
  }
  
  const { activeStep, lastActivableStep, setActiveStep, steps } =
    useActiveStep()

  const getStepNumber = (stepName: SingleStepEnum) => {
    return steps.indexOf(stepName) + 1
  }

  if (!ctx || ctx.isFirstLoading) {
    return <CheckoutSkeleton />
  }
  const renderComplete = () => {
    return (
      <StepComplete
        logoUrl={logoUrl}
        companyName={companyName}
        supportEmail={supportEmail}
        supportPhone={supportPhone}
        orderNumber={orderNumber}
      />
    )
  }

  const renderSteps = () => {
    return (
      <CustomerContainer isGuest={ctx.isGuest}>
        <LayoutDefault
          aside={
            <Sidebar>
              <Logo
                logoUrl={logoUrl}
                companyName={companyName}
                className="hidden md:block"
              />
              <SummaryWrapper>
                <OrderSummary appCtx={ctx} />
              </SummaryWrapper>
              <Footer />
            </Sidebar>
          }
          main={
            <div>
              <Logo
                logoUrl={logoUrl}
                companyName={companyName}
                className="block md:hidden"
              />
              <MainHeader orderNumber={orderNumber} />
              <StepNav
                steps={steps}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                lastActivable={lastActivableStep}
              />
              <Accordion>
                <AccordionProvider
                  activeStep={activeStep}
                  lastActivableStep={lastActivableStep}
                  setActiveStep={setActiveStep}
                  step="Customer"
                  steps={steps}
                  isStepDone={ctx.hasShippingAddress && ctx.hasBillingAddress}
                >
                  <AccordionItem
                    index={1}
                    header={
                      <StepHeaderCustomer step={getStepNumber("Customer")} />
                    }
                  >
                    <StepCustomer className="mb-6" step={1} />
                  </AccordionItem>
                </AccordionProvider>
                <>
                  {ctx.isShipmentRequired && (
                    <AccordionProvider
                      activeStep={activeStep}
                      lastActivableStep={lastActivableStep}
                      setActiveStep={setActiveStep}
                      step="Shipping"
                      steps={steps}
                      isStepRequired={ctx.isShipmentRequired}
                      isStepDone={ctx.hasShippingMethod}
                    >
                      <AccordionItem
                        index={2}
                        header={
                          <StepHeaderShipping
                            step={getStepNumber("Shipping")}
                          />
                        }
                      >
                        <StepShipping className="mb-6" step={2} />
                      </AccordionItem>
                    </AccordionProvider>
                  )}
                </>
                <AccordionProvider
                  activeStep={activeStep}
                  lastActivableStep={lastActivableStep}
                  setActiveStep={setActiveStep}
                  step="Payment"
                  steps={steps}
                  isStepRequired={ctx.isPaymentRequired}
                  isStepDone={ctx.hasPaymentMethod}
                >
                  <PaymentContainer>
                    <PlaceOrderContainer
                      options={{
                        paypalPayerId,
                        checkoutCom: { session_id: checkoutComSession },
                        adyen: {
                          redirectResult,
                        },
                        stripe: { redirectStatus },
                      }}
                    >
                      <AccordionItem
                        index={3}
                        header={
                          <StepHeaderPayment step={getStepNumber("Payment")} />
                        }
                      >
                        <div className="mb-6">
                          <StepPayment />
                        </div>
                      </AccordionItem>
                      <StepPlaceOrder
                        isActive={
                          activeStep === "Payment" || activeStep === "Complete"
                        }
                        termsUrl={termsUrl}
                        privacyUrl={privacyUrl}
                      />
                    </PlaceOrderContainer>
                  </PaymentContainer>
                </AccordionProvider>
              </Accordion>
            </div>
          }
        />
      </CustomerContainer>
    )
  }

  return (
    <OrderContainer orderId={ctx.orderId} fetchOrder={ctx.getOrder as any}>
      {ctx.isComplete ? renderComplete() : renderSteps()}
    </OrderContainer>
  )
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 lg:pl-20 lg:pr-10 lg:pt-10 xl:pl-48 bg-gray-50`}
`
const SummaryWrapper = styled.div`
  ${tw`flex-1`}
`
export default Checkout
