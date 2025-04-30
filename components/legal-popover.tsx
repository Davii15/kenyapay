"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LegalPopoverProps {
  title: string
  type: "terms" | "privacy" | "cookies" | "refund"
  children: React.ReactNode
  className?: string
}

export function LegalPopover({ title, type, children, className }: LegalPopoverProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className={`p-0 h-auto text-muted-foreground hover:text-amber-600 ${className}`}>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">{children}</div>
        </ScrollArea>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TermsOfService() {
  return (
    <LegalPopover title="Terms of Service" type="terms">
      <h3 className="text-lg font-semibold">1. Introduction</h3>
      <p>
        Welcome to KenyaPay. These Terms of Service govern your use of our website and mobile application. By accessing
        or using KenyaPay, you agree to be bound by these Terms.
      </p>

      <h3 className="text-lg font-semibold">2. Definitions</h3>
      <p>
        <strong>"Service"</strong> refers to the KenyaPay platform, including our website and mobile application.
        <br />
        <strong>"User"</strong> refers to individuals who register to use our Service.
        <br />
        <strong>"Tourist User"</strong> refers to individuals who register as tourists.
        <br />
        <strong>"Business User"</strong> refers to businesses that register to accept payments through our Service.
      </p>

      <h3 className="text-lg font-semibold">3. Account Registration</h3>
      <p>
        To use KenyaPay, you must register for an account. You agree to provide accurate, current, and complete
        information during the registration process and to update such information to keep it accurate, current, and
        complete.
      </p>
      <p>
        Tourist Users must provide valid identification documents for verification purposes. Business Users must provide
        valid business registration documents. We reserve the right to suspend or terminate accounts with inaccurate or
        incomplete information.
      </p>

      <h3 className="text-lg font-semibold">4. User Verification</h3>
      <p>
        All users must complete our verification process. Tourist Users must upload a valid passport or
        government-issued ID. Business Users must upload valid business registration documents. Verification status may
        be pending, verified, or rejected.
      </p>
      <p>
        Users with rejected verification may resubmit documents. We reserve the right to limit functionality for
        unverified users.
      </p>

      <h3 className="text-lg font-semibold">5. Service Description</h3>
      <p>
        KenyaPay provides a platform for tourists to convert their currency to Kenyan Shillings and make payments to
        local businesses. Business Users can receive payments through the platform.
      </p>

      <h3 className="text-lg font-semibold">6. Fees and Charges</h3>
      <p>
        KenyaPay charges a fee for currency conversion (typically 1-2% depending on the currency). There are no fees for
        maintaining an account. Business Users may be subject to transaction fees as outlined in their agreement.
      </p>

      <h3 className="text-lg font-semibold">7. User Conduct</h3>
      <p>You agree not to use the Service to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on the rights of others</li>
        <li>Engage in fraudulent activities</li>
        <li>Distribute malware or other harmful content</li>
        <li>Attempt to gain unauthorized access to the Service</li>
        <li>Use the Service for money laundering or financing illegal activities</li>
      </ul>

      <h3 className="text-lg font-semibold">8. Intellectual Property</h3>
      <p>
        The Service and its original content, features, and functionality are owned by KenyaPay and are protected by
        international copyright, trademark, patent, trade secret, and other intellectual property laws.
      </p>

      <h3 className="text-lg font-semibold">9. Termination</h3>
      <p>
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
        including if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
      </p>

      <h3 className="text-lg font-semibold">10. Limitation of Liability</h3>
      <p>
        In no event shall KenyaPay, its directors, employees, partners, agents, suppliers, or affiliates be liable for
        any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of
        profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability
        to access or use the Service.
      </p>

      <h3 className="text-lg font-semibold">11. Governing Law</h3>
      <p>
        These Terms shall be governed by the laws of Kenya, without regard to its conflict of law provisions. Any
        dispute arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of
        Kenya.
      </p>

      <h3 className="text-lg font-semibold">12. Changes to Terms</h3>
      <p>
        We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at
        least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be
        determined at our sole discretion.
      </p>

      <h3 className="text-lg font-semibold">13. Contact Us</h3>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:legal@kenyapay.com" className="text-amber-600 hover:underline">
          legal@kenyapay.com
        </a>
        .
      </p>
    </LegalPopover>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPopover title="Privacy Policy" type="privacy">
      <h3 className="text-lg font-semibold">1. Introduction</h3>
      <p>
        At KenyaPay, we respect your privacy and are committed to protecting your personal data. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information when you use our Service.
      </p>

      <h3 className="text-lg font-semibold">2. Information We Collect</h3>
      <p>We collect several types of information from and about users of our Service, including:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Personal Identification Information:</strong> Name, email address, phone number, country of residence,
          passport or ID information (for Tourist Users), business registration information (for Business Users).
        </li>
        <li>
          <strong>Financial Information:</strong> Payment method details, transaction history, wallet balance.
        </li>
        <li>
          <strong>Technical Information:</strong> IP address, browser type, device information, cookies, usage data.
        </li>
      </ul>

      <h3 className="text-lg font-semibold">3. How We Collect Information</h3>
      <p>We collect information through:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Direct interactions when you register, make transactions, or contact us</li>
        <li>Automated technologies such as cookies and similar tracking technologies</li>
        <li>Third parties such as payment processors and identity verification services</li>
      </ul>

      <h3 className="text-lg font-semibold">4. How We Use Your Information</h3>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Provide, maintain, and improve our Service</li>
        <li>Process transactions and send related information</li>
        <li>Verify your identity and prevent fraud</li>
        <li>Communicate with you about our Service</li>
        <li>Comply with legal obligations</li>
        <li>Monitor and analyze usage patterns and trends</li>
      </ul>

      <h3 className="text-lg font-semibold">5. Disclosure of Your Information</h3>
      <p>We may disclose your personal information to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Service providers who perform services on our behalf</li>
        <li>Business partners with your consent</li>
        <li>Legal authorities when required by law</li>
        <li>
          Third parties in connection with a business transaction such as a merger, sale of assets, or acquisition
        </li>
      </ul>

      <h3 className="text-lg font-semibold">6. Data Security</h3>
      <p>
        We implement appropriate security measures to protect your personal information from unauthorized access,
        alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
        storage is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h3 className="text-lg font-semibold">7. Data Retention</h3>
      <p>
        We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy
        Policy, unless a longer retention period is required or permitted by law.
      </p>

      <h3 className="text-lg font-semibold">8. Your Data Protection Rights</h3>
      <p>Depending on your location, you may have the following rights:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>The right to access your personal information</li>
        <li>The right to rectify inaccurate personal information</li>
        <li>The right to request deletion of your personal information</li>
        <li>The right to restrict processing of your personal information</li>
        <li>The right to data portability</li>
        <li>The right to object to processing of your personal information</li>
      </ul>

      <h3 className="text-lg font-semibold">9. Children's Privacy</h3>
      <p>
        Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information
        from children under 18. If you are a parent or guardian and believe your child has provided us with personal
        information, please contact us.
      </p>

      <h3 className="text-lg font-semibold">10. Changes to Our Privacy Policy</h3>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy
        Policy on this page and updating the "Last Updated" date.
      </p>

      <h3 className="text-lg font-semibold">11. Contact Us</h3>
      <p>
        If you have questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:privacy@kenyapay.com" className="text-amber-600 hover:underline">
          privacy@kenyapay.com
        </a>
        .
      </p>
    </LegalPopover>
  )
}

export function CookiePolicy() {
  return (
    <LegalPopover title="Cookie Policy" type="cookies">
      <h3 className="text-lg font-semibold">1. Introduction</h3>
      <p>
        This Cookie Policy explains how KenyaPay uses cookies and similar technologies to recognize you when you visit
        our website and mobile application. It explains what these technologies are and why we use them, as well as your
        rights to control our use of them.
      </p>

      <h3 className="text-lg font-semibold">2. What Are Cookies?</h3>
      <p>
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies
        are widely used by website owners to make their websites work, or to work more efficiently, as well as to
        provide reporting information.
      </p>

      <h3 className="text-lg font-semibold">3. Types of Cookies We Use</h3>
      <p>We use the following types of cookies:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and
          cannot be switched off in our systems. They are usually set in response to actions made by you which amount to
          a request for services, such as setting your privacy preferences, logging in, or filling in forms.
        </li>
        <li>
          <strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can
          measure and improve the performance of our site. They help us to know which pages are the most and least
          popular and see how visitors move around the site.
        </li>
        <li>
          <strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and
          personalization. They may be set by us or by third-party providers whose services we have added to our pages.
        </li>
        <li>
          <strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners.
          They may be used by those companies to build a profile of your interests and show you relevant advertisements
          on other sites.
        </li>
      </ul>

      <h3 className="text-lg font-semibold">4. Third-Party Cookies</h3>
      <p>
        In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the
        Service, deliver advertisements on and through the Service, and so on.
      </p>

      <h3 className="text-lg font-semibold">5. How to Control Cookies</h3>
      <p>
        You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you
        may still use our website though your access to some functionality and areas of our website may be restricted.
      </p>
      <p>The means to control cookies vary by browser:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
        <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
        <li>Safari: Preferences → Privacy → Cookies and website data</li>
        <li>Edge: Settings → Cookies and site permissions → Cookies</li>
      </ul>

      <h3 className="text-lg font-semibold">6. Mobile Applications</h3>
      <p>
        Our mobile applications may use similar technologies to cookies, such as local storage, to enhance your
        experience. You can manage these through your device settings.
      </p>

      <h3 className="text-lg font-semibold">7. Updates to This Cookie Policy</h3>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business
        practices. Any changes will become effective when we post the revised Cookie Policy.
      </p>

      <h3 className="text-lg font-semibold">8. Contact Us</h3>
      <p>
        If you have any questions about our use of cookies, please contact us at{" "}
        <a href="mailto:privacy@kenyapay.com" className="text-amber-600 hover:underline">
          privacy@kenyapay.com
        </a>
        .
      </p>
    </LegalPopover>
  )
}

export function RefundPolicy() {
  return (
    <LegalPopover title="Refund Policy" type="refund">
      <h3 className="text-lg font-semibold">1. Introduction</h3>
      <p>
        This Refund Policy outlines the terms and conditions for refunds on KenyaPay. We strive to ensure fair and
        transparent refund processes for all our users.
      </p>

      <h3 className="text-lg font-semibold">2. Top-Up Refunds</h3>
      <p>
        <strong>Successful Top-Ups:</strong> Once funds have been successfully added to your KenyaPay wallet, they
        cannot be directly refunded to your original payment method. However, you may withdraw the funds through our
        withdrawal process.
      </p>
      <p>
        <strong>Failed Top-Ups:</strong> If you attempted to add funds to your wallet but the transaction failed, no
        funds will be deducted from your payment method. If funds were deducted but not credited to your wallet, please
        contact our support team within 7 days with your transaction details.
      </p>

      <h3 className="text-lg font-semibold">3. Payment Refunds</h3>
      <p>
        <strong>Disputed Transactions:</strong> If you made a payment to a business through KenyaPay and wish to dispute
        the transaction, you must contact our support team within 48 hours of the transaction. We will investigate the
        claim and may require documentation from both parties.
      </p>
      <p>
        <strong>Unauthorized Transactions:</strong> If you believe an unauthorized transaction has occurred on your
        account, contact our support team immediately. We take security very seriously and will investigate all claims
        of unauthorized access.
      </p>

      <h3 className="text-lg font-semibold">4. Withdrawal Cancellations</h3>
      <p>
        <strong>Pending Withdrawals:</strong> You may cancel a pending withdrawal request before it is processed. Once a
        withdrawal has been processed, it cannot be reversed.
      </p>
      <p>
        <strong>Failed Withdrawals:</strong> If a withdrawal fails, the funds will be returned to your KenyaPay wallet
        automatically. No action is required on your part.
      </p>

      <h3 className="text-lg font-semibold">5. Service Fee Refunds</h3>
      <p>
        <strong>Currency Conversion Fees:</strong> Currency conversion fees are non-refundable once a transaction has
        been completed.
      </p>
      <p>
        <strong>Transaction Fees:</strong> Transaction fees are non-refundable unless the transaction itself is
        determined to be eligible for a refund due to an error on our part.
      </p>

      <h3 className="text-lg font-semibold">6. Refund Process</h3>
      <p>
        <strong>Refund Requests:</strong> All refund requests must be submitted through our support system with relevant
        transaction details.
      </p>
      <p>
        <strong>Processing Time:</strong> Refund requests are typically processed within 5-7 business days. The time it
        takes for the refund to appear in your account depends on your payment provider.
      </p>

      <h3 className="text-lg font-semibold">7. Exceptions</h3>
      <p>
        <strong>Fraudulent Activity:</strong> KenyaPay reserves the right to deny refund requests if we suspect
        fraudulent activity.
      </p>
      <p>
        <strong>Terms Violations:</strong> Refunds may be denied if the transaction in question violated our Terms of
        Service.
      </p>

      <h3 className="text-lg font-semibold">8. Changes to This Policy</h3>
      <p>
        We may update this Refund Policy from time to time. Any changes will be posted on this page with an updated
        revision date.
      </p>

      <h3 className="text-lg font-semibold">9. Contact Us</h3>
      <p>
        If you have questions about our Refund Policy or need to request a refund, please contact our support team at{" "}
        <a href="mailto:support@kenyapay.com" className="text-amber-600 hover:underline">
          support@kenyapay.com
        </a>
        .
      </p>
    </LegalPopover>
  )
}
