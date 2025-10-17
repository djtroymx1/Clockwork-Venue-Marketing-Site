import React from "react";
import { legalConfig } from "@/lib/legal";
import Link from "next/link";

export const metadata = { title: `Privacy Policy - ${legalConfig.brandName}` };

export default function Page() {
  return (
    <main className="sf-legal" role="main">
      <h1>Privacy Policy</h1>
      <p>Last updated: September 5, 2024</p>

      <p>
        Your privacy is important to us. This Privacy Policy explains how
        Digital Visionworks LLC ("we," "us," or "our") collects, uses, and
        discloses information about you when you access or use our website,
        applications, and services (collectively, the "Service"). We use cookies
        to operate and improve Clockwork Venue. You can manage preferences in
        your browser settings.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, information we
        collect automatically, and information we may receive from other
        sources.
      </p>
      <ul>
        <li>
          <strong>Account Information:</strong> When you register for an
          account, we collect information such as your name, email address, role
          (e.g., DJ, Manager), and club affiliation.
        </li>
        <li>
          <strong>Usage Data:</strong> We automatically log information about
          your interactions with the Service, including login times, features
          used, and actions taken (like stage rotations or data exports).
        </li>
        <li>
          <strong>Device and Browser Information:</strong> We collect standard
          information from your device, such as IP address, browser type,
          operating system, and identifiers associated with your device.
        </li>
        <li>
          <strong>Payment Information:</strong> Our payment processor, Stripe,
          collects payment information when you subscribe to a paid plan.
          Clockwork Venue does not store your raw credit card number but
          receives billing metadata from Stripe such as your billing address and
          transaction history.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect for the following purposes:</p>
      <ul>
        <li>To provide, maintain, and improve the Service.</li>
        <li>To process payments and manage subscriptions.</li>
        <li>To personalize your experience and customize content.</li>
        <li>
          To monitor and analyze trends, usage, and activities in connection
          with our Service.
        </li>
        <li>
          To maintain the security of our platform, prevent fraud, and enforce
          our Terms of Service.
        </li>
        <li>
          To respond to your comments, questions, and requests, and provide
          customer service.
        </li>
        <li>For legal and compliance purposes, as required by applicable law.</li>
      </ul>

      <h2>3. Sharing and Disclosure of Information</h2>
      <p>We do not sell your personal data. We may share your information in the following limited circumstances:</p>
      <ul>
        <li>
          <strong>With Service Providers:</strong> We may share information with
          third-party vendors and service providers who need access to such
          information to carry out work on our behalf (e.g., cloud hosting,
          analytics, payment processing via Stripe).
        </li>
        <li>
          <strong>For Legal Reasons:</strong> We may disclose information if we
          believe disclosure is in accordance with, or required by, any
          applicable law, regulation, or legal process.
        </li>
        <li>
          <strong>With Your Consent:</strong> We may share information with your
          consent or at your direction.
        </li>
        <li>
          <strong>Aggregate Data:</strong> We may share aggregated or
          de-identified information, which cannot reasonably be used to identify
          you.
        </li>
      </ul>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to help us operate and
        improve the Service. Cookies are small data files stored on your hard
        drive or in device memory. We use them to see which areas and features
        of our Service are popular and to count visits. You can typically set
        your browser to remove or reject browser cookies. As noted in our cookie
        banner, your continued use of our site constitutes consent to our use of
        cookies.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is
        active or as needed to provide you with the Service. We may also retain
        information as required to comply with our legal obligations, resolve
        disputes, and enforce our agreements. You may request deletion of your
        account and data by contacting us.
      </p>

      <h2>6. Security</h2>
      <p>
        We take reasonable measures to help protect information about you from
        loss, theft, misuse, and unauthorized access, disclosure, alteration,
        and destruction. However, no electronic transmission or storage of
        information is ever completely secure, so we cannot guarantee the
        absolute security of your data.
      </p>

      <h2>7. Your Rights and Choices</h2>
      <p>
        You have certain rights regarding your personal information. You may
        review, update, or correct your account information at any time by
        logging into your account. You may also request deletion of your account
        and personal data, subject to certain exceptions.
      </p>
      <p>
        You can opt out of receiving promotional communications from us by
        following the instructions in those communications. If you opt out, we
        may still send you non-promotional emails, such as those about your
        account or our ongoing business relations.
      </p>

      <h2>8. International Users</h2>
      <p>
        Our Service is based in the United States, and we use service providers
        that may be located in the U.S. or other countries. By accessing or
        using the Service, you consent to the processing, transfer, and storage
        of information in and to the U.S. and other countries, where you may not
        have the same rights and protections as you do under local law.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        The Service is not intended for or directed to individuals under the age
        of 18. We do not knowingly collect personal information from children
        under 18.
      </p>

      <h2>10. Changes to this Policy</h2>
      <p>
        We may change this Privacy Policy from time to time. If we make changes,
        we will notify you by revising the date at the top of the policy and, in
        some cases, we may provide you with additional notice (such as adding a
        statement to our homepage or sending you a notification).
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at <a href="mailto:privacy@stageflowlive.com">privacy@stageflowlive.com</a>.
      </p>

      <p>
        <Link href="/legal">Return to Legal</Link>
      </p>
    </main>
  );
}
