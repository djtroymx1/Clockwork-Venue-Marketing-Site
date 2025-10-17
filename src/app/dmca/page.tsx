import React from "react";
import { legalConfig } from "@/lib/legal";
import Link from "next/link";

export const metadata = { title: `DMCA Policy - ${legalConfig.brandName}` };

export default function Page() {
  return (
    <main className="sf-legal" role="main">
      <h1>DMCA Takedown Policy</h1>
      <p>Last updated: September 5, 2024</p>

      <h2>1. Introduction</h2>
      <p>
        Digital Visionworks LLC ("we," "us," or "our") complies with the U.S.
        Digital Millennium Copyright Act ("DMCA"). This policy outlines the
        procedure for copyright owners to notify us of alleged copyright
        infringement on the Clockwork Venue service (the "Service") and for
        users to respond to such notices.
      </p>

      <h2>2. Submitting a DMCA Notice</h2>
      <p>
        If you are a copyright owner or an agent thereof and believe that any
        content hosted on our Service infringes upon your copyrights, you may
        submit a notification pursuant to the DMCA by providing our designated
        Copyright Agent with the following information in writing:
      </p>
      <ul>
        <li>
          A physical or electronic signature of a person authorized to act on
          behalf of the owner of an exclusive right that is allegedly infringed.
        </li>
        <li>
          Identification of the copyrighted work claimed to have been infringed,
          or, if multiple copyrighted works are covered by a single notification,
          a representative list of such works.
        </li>
        <li>
          Identification of the material that is claimed to be infringing or to
          be the subject of infringing activity and that is to be removed or
          access to which is to be disabled, and information reasonably
          sufficient to permit us to locate the material (e.g., a URL).
        </li>
        <li>
          Information reasonably sufficient to permit us to contact you, such as
          an address, telephone number, and, if available, an email address.
        </li>
        <li>
          A statement that you have a good faith belief that use of the material
          in the manner complained of is not authorized by the copyright owner,
          its agent, or the law.
        </li>
        <li>
          A statement that the information in the notification is accurate, and
          under penalty of perjury, that you are authorized to act on behalf of
          the owner of an exclusive right that is allegedly infringed.
        </li>
      </ul>
      <p>
        Notices should be sent to our designated Copyright Agent at{" "}
        <a href="mailto:legal@stageflowlive.com">legal@stageflowlive.com</a>.
      </p>

      <h2>3. Submitting a Counter-Notice</h2>
      <p>
        If you believe that your content that was removed (or to which access
        was disabled) is not infringing, or that you have the authorization from
        the copyright owner, the copyright owner's agent, or pursuant to the
        law, to post and use the material in your content, you may send a
        counter-notice to our Copyright Agent containing the following
        information:
      </p>
      <ul>
        <li>Your physical or electronic signature.</li>
        <li>
          Identification of the content that has been removed or to which access
          has been disabled and the location at which the content appeared before
          it was removed or disabled.
        </li>
        <li>
          A statement under penalty of perjury that you have a good faith belief
          that the content was removed or disabled as a result of mistake or a
          misidentification of the content.
        </li>
        <li>
          Your name, address, telephone number, and email address, a statement
          that you consent to the jurisdiction of the federal court in Florida,
          and a statement that you will accept service of process from the person
          who provided notification of the alleged infringement.
        </li>
      </ul>
      <p>
        If a counter-notice is received by our Copyright Agent, we may send a
        copy of the counter-notice to the original complaining party informing
        that person that we may replace the removed content or cease disabling it
        in 10 business days. Unless the copyright owner files an action seeking a
        court order against the content provider, member, or user, the removed
        content may be replaced, or access to it restored, in 10 to 14 business
        days or more after receipt of the counter-notice, at our sole discretion.
      </p>

      <h2>4. Repeat Infringer Policy</h2>
      <p>
        In accordance with the DMCA and other applicable law, Digital
        Visionworks LLC has adopted a policy of terminating, in appropriate
        circumstances and at our sole discretion, users who are deemed to be
        repeat infringers. We may also at our sole discretion limit access to
        the Service and/or terminate the accounts of any users who infringe any
        intellectual property rights of others, whether or not there is any
        repeat infringement.
      </p>

      <h2>5. Disclaimer</h2>
      <p>
        This information is provided for informational purposes only and does
        not constitute legal advice. If you have legal questions or believe your
        rights have been infringed, you should consult with a qualified attorney.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        For any questions regarding this DMCA Policy, please contact our
        Copyright Agent at{" "}
        <a href="mailto:legal@stageflowlive.com">legal@stageflowlive.com</a>.
      </p>

      <p>
        <Link href="/legal">Return to Legal</Link>
      </p>
    </main>
  );
}
