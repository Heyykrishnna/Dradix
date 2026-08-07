"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Noise from "@/components/Noise";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

interface Section {
  id: string;
  title: string;
  badge: string;
  content: React.ReactNode;
}

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("section-1");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTocClick = (secId: string) => {
    setActiveSection(secId);
    isClickScrollingRef.current = true;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    document.getElementById(secId)?.scrollIntoView({ behavior: "smooth" });

    const resetClickScroll = () => {
      isClickScrollingRef.current = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("scrollend", resetClickScroll);
      }
    };

    if (typeof window !== "undefined" && "onscrollend" in window) {
      window.addEventListener("scrollend", resetClickScroll, { once: true });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("scrollend", resetClickScroll);
      }
    }, 1000);
  };

  const contactEmail = "support@dradix.dev";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const sections: Section[] = useMemo(
    () => [
      {
        id: "section-1",
        title: "1. Agreement to Terms & Contractual Framework",
        badge: "OVERVIEW",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              These Terms of Service (&quot;Terms,&quot; &quot;Agreement&quot;)
              constitute a legally binding agreement between you
              (&quot;User,&quot; &quot;Developer,&quot; or &quot;you&quot;) and{" "}
              <strong className="text-zinc-900 font-semibold">
                Dradix Technologies Inc.
              </strong>{" "}
              (&quot;Dradix,&quot; &quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;), governing your access to and use of the Dradix
              platform, web application, API endpoints, developer CLI tools,
              metrics engines, AI Career Coach modules, and associated services
              (collectively, the &quot;Service&quot;).
            </p>
            <p className="text-zinc-700 leading-relaxed">
              By registering an account, connecting third-party developer
              profiles, invoking Dradix API endpoints, or accessing any portion
              of our Service, you explicitly acknowledge that you have read,
              understood, and agreed to be legally bound by these Terms, along
              with our{" "}
              <Link
                href="/privacy"
                className="text-[#015451] font-semibold underline"
              >
                Privacy Policy
              </Link>
              . If you are accepting these Terms on behalf of an employer,
              company, or other legal entity, you represent and warrant that you
              possess full legal authority to bind such entity to this
              Agreement.
            </p>
            <div className="bg-[#015451]/5 border border-[#015451]/20 rounded-2xl p-5 mt-4 text-[#003c3a] space-y-2">
              <h4 className="font-bold text-sm text-[#015451]">
                Important Mandatory Arbitration Notice
              </h4>
              <p className="text-xs leading-relaxed text-[#003c3a]/90">
                PLEASE READ SECTION 15 CAREFULLY. IT CONTAINS A BINDING
                ARBITRATION AGREEMENT AND CLASS ACTION WAIVER THAT REQUIRE ALL
                DISPUTES WITH DRADIX TO BE RESOLVED THROUGH INDIVIDUAL
                ARBITRATION RATHER THAN IN COURT, EXCEPT WHERE PROHIBITED BY
                APPLICABLE LAW.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "section-2",
        title: "2. Account Eligibility, Security & OAuth Credentials",
        badge: "ACCOUNT SAFETY",
        content: (
          <div className="space-y-6">
            <p className="text-zinc-700 leading-relaxed">
              To utilize Dradix developer services, portfolio cards, and metric
              scoring engines, you must create a verified user account. Account
              creation and operation are subject to the following explicit
              requirements:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5">
                <h4 className="font-bold text-zinc-900 text-sm mb-3">
                  Age & Contractual Capacity
                </h4>
                <ul className="text-xs text-zinc-600 space-y-2.5 list-disc list-outside pl-4 leading-relaxed marker:text-[#015451]">
                  <li>
                    You must be at least 13 years of age (or 16 in certain EU
                    member states) to create an account.
                  </li>
                  <li>
                    Users under the age of 18 must have explicit consent and
                    supervision from a legal parent or guardian.
                  </li>
                  <li>
                    You must not be prohibited from accessing cloud software
                    services under applicable international sanction laws.
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5">
                <h4 className="font-bold text-zinc-900 text-sm mb-3">
                  Account Credentials & OAuth Isolation
                </h4>
                <ul className="text-xs text-zinc-600 space-y-2.5 list-disc list-outside pl-4 leading-relaxed marker:text-[#015451]">
                  <li>
                    You are solely responsible for maintaining the
                    confidentiality of your login credentials and OAuth session
                    tokens.
                  </li>
                  <li>
                    Account sharing, credential transfer, or selling Dradix user
                    accounts is strictly prohibited.
                  </li>
                  <li>
                    You must immediately notify Dradix at{" "}
                    <span className="text-[#015451] font-semibold">
                      {contactEmail}
                    </span>{" "}
                    if you suspect unauthorized access or credential compromise.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-3",
        title: "3. Developer Platform License & Intellectual Property",
        badge: "PROPRIETARY RIGHTS",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Subject to your compliance with these Terms, Dradix grants you a
              limited, non-exclusive, non-transferable, non-sublicensable,
              revocable license to access and use the Service for your personal
              developer portfolio or authorized internal business purposes.
            </p>

            <div className="space-y-3">
              <div className="flex gap-3 items-start p-3.5 bg-white rounded-xl border border-zinc-200/70 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#015451]/10 text-[#015451] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  1
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900">
                    Dradix Intellectual Property Rights
                  </h5>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    The Service, including software code, algorithm design,
                    developer XP scoring formulas, UI components, vector
                    graphics, brand logos, visual styling, and aggregated
                    benchmarks, is owned exclusively by Dradix and protected
                    under international copyright, trademark, and trade secret
                    laws.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3.5 bg-white rounded-xl border border-zinc-200/70 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#015451]/10 text-[#015451] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  2
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900">
                    User Ownership of Source Code & Raw Data
                  </h5>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    You retain complete and unencumbered ownership of your
                    original repository source code, personal resume documents,
                    submitted prompts, and raw competitive programming profile
                    statistics. Dradix claims zero ownership over your
                    intellectual property.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-4",
        title: "4. Connected Third-Party Integrations & Data Synchronization",
        badge: "INTEGRATIONS",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Dradix aggregates developer telemetry by establishing API
              connections with third-party platforms (including GitHub,
              LeetCode, Codeforces, CodeChef, and WakaTime).
            </p>

            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-zinc-900 text-sm">
                Third-Party API Disclaimers & Scopes
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                When linking third-party accounts, you authorize Dradix to
                request read-only scopes necessary to compute metrics. You
                acknowledge that:
              </p>
              <ul className="text-xs text-zinc-600 space-y-2.5 list-disc list-outside pl-4 leading-relaxed marker:text-[#015451]">
                <li>
                  Dradix is not affiliated with, endorsed by, or sponsored by
                  GitHub, LeetCode, Codeforces, CodeChef, or WakaTime.
                </li>
                <li>
                  Third-party platform API outages, rate limits, schema changes,
                  or service disruptions may temporarily affect Dradix metric
                  updates.
                </li>
                <li>
                  You can revoke Dradix&apos;s API permissions at any time
                  directly through the connected provider&apos;s security
                  settings.
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "section-5",
        title: "5. AI Career Coach, LLM Telemetry & Output Disclaimers",
        badge: "AI SERVICES",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Dradix provides AI-powered features, including the AI Career
              Coach, automated resume analysis, skill radar generation, and code
              contribution summaries.
            </p>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 text-xs leading-relaxed">
              <strong className="font-bold text-amber-950 block mb-1">
                AI Output Disclaimer & Advisory Notice
              </strong>
              AI-generated suggestions, resume formatting, skill assessments,
              and career recommendations are provided strictly for informational
              and guidance purposes. Dradix does not guarantee job placement,
              interview outcomes, code accuracy, or employment offers based on
              AI outputs.
            </div>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-zinc-900 text-sm">
                Model Training Policy Guarantee
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                We enforce isolated enterprise API processing. Your private code
                repositories, prompt history, and uploaded resume text will{" "}
                <strong className="text-zinc-900 font-semibold">NEVER</strong>{" "}
                be used to train public foundation models or shared artificial
                intelligence algorithms.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "section-6",
        title: "6. User Content Rights, Showcases & Public Profiles",
        badge: "PUBLIC SHOWCASES",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Dradix allows developers to generate public developer cards,
              metric showcase URLs, and verified identity profiles.
            </p>

            <ul className="space-y-3 text-xs text-zinc-600">
              <li className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-0.5">
                  License Grant to Display Public Profiles:
                </strong>
                By marking your profile as &quot;Public,&quot; you grant Dradix
                a worldwide, royalty-free license to host, format, display, and
                render your designated developer metrics, avatar, and badges for
                external viewers.
              </li>
              <li className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-0.5">
                  Profile Visibility Controls:
                </strong>
                You maintain total authority to toggle your profile to
                &quot;Private&quot; at any time, which immediately hides your
                showcase link from public search engines and unauthenticated
                visitors.
              </li>
              <li className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-0.5">
                  Accuracy Warranty:
                </strong>
                You agree not to submit falsified competitive ratings,
                artificial commit activity, or deceptive resume claims designed
                to mislead recruiters or platform members.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "section-7",
        title: "7. Acceptable Use Policy & Prohibited Conduct",
        badge: "ACCEPTABLE USE",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              You agree to use the Dradix platform strictly in compliance with
              all applicable laws and regulations. You shall NOT engage in any
              of the following prohibited activities:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Reverse Engineering & Scraping
                </strong>
                Decompiling, scraping, reverse engineering, or extracting
                underlying source code, algorithms, or private APIs from the
                Service.
              </div>
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Automated Bot & Rate Abuse
                </strong>
                Utilizing automated scripts, bots, or crawlers to flood Dradix
                servers or bypass rate-limiting controls.
              </div>
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Security Interference & Probing
                </strong>
                Attempting to probe, scan, or test vulnerabilities of any Dradix
                network, server, database, or authentication mechanism.
              </div>
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Impersonation & Malicious Uploads
                </strong>
                Impersonating any person or entity, or uploading code scripts
                containing malware, viruses, or malicious payloads.
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-8",
        title: "8. API Quotas, Fair Use Policy & System Rate Limits",
        badge: "RATE LIMITS",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              To preserve platform stability, response speed, and infrastructure
              health for all developers, Dradix enforces rate limits across web,
              CLI, and API requests.
            </p>

            <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-900 font-bold">
                    <th className="p-3">Tier</th>
                    <th className="p-3">API Quota / Minute</th>
                    <th className="p-3">Sync Refresh Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-600">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">
                      Community Tier (Free)
                    </td>
                    <td className="p-3">60 requests / min</td>
                    <td className="p-3">6 Hours</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">
                      Pro Developer Tier
                    </td>
                    <td className="p-3">300 requests / min</td>
                    <td className="p-3">15 Minutes</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900">
                      Enterprise / Team Tier
                    </td>
                    <td className="p-3">1,200 requests / min</td>
                    <td className="p-3">Real-time Webhook</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500">
              Requests exceeding assigned rate caps will receive HTTP 429
              (&quot;Too Many Requests&quot;) responses. Repeated attempts to
              bypass rate throttling may trigger temporary IP blocks.
            </p>
          </div>
        ),
      },
      {
        id: "section-9",
        title: "9. Subscriptions, Payment Terms, Taxes & Cancellation",
        badge: "BILLING & REFUNDS",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Certain premium features (including advanced AI career roadmaps,
              real-time sync, and custom domain showcases) may require a paid
              subscription.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center">
                <h5 className="font-bold text-zinc-900 mb-1">Auto-Renewal</h5>
                <p className="text-zinc-500 text-[11px]">
                  Paid subscriptions automatically renew at the start of each
                  billing cycle unless cancelled.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center">
                <h5 className="font-bold text-zinc-900 mb-1">
                  14-Day Refund Guarantee
                </h5>
                <p className="text-zinc-500 text-[11px]">
                  New annual subscriptions are eligible for a full refund within
                  14 days of purchase.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center">
                <h5 className="font-bold text-zinc-900 mb-1">
                  Instant Cancellation
                </h5>
                <p className="text-zinc-500 text-[11px]">
                  Cancel anytime via Account Settings to stop future recurring
                  charges.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-10",
        title: "10. Platform Availability, Maintenance & Uptime SLA",
        badge: "SERVICE LEVELS",
        content: (
          <div className="space-y-3">
            <p className="text-zinc-700 leading-relaxed">
              Dradix strives to maintain a target service uptime of 99.9% for
              core dashboard endpoints and public portfolio rendering. However,
              service availability is provided on an &quot;as-is&quot; basis.
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Routine scheduled maintenance is conducted during low-traffic
              windows with advance notice posted on our official status page.
              Outages caused by upstream cloud providers, Internet backbone
              disruptions, or third-party OAuth provider outages are excluded
              from uptime calculations.
            </p>
          </div>
        ),
      },
      {
        id: "section-11",
        title: '11. Disclaimer of Warranties ("As-Is" & "As-Available")',
        badge: "DISCLAIMERS",
        content: (
          <div className="space-y-4">
            <div className="bg-zinc-900 text-white rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider">
                Statutory Express Disclaimer
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE DRADIX
                SERVICE IS PROVIDED ENTIRELY &quot;AS IS&quot; AND &quot;AS
                AVAILABLE,&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS,
                IMPLIED, STATUTORY, OR OTHERWISE. DRADIX EXPRESSLY DISCLAIMS ALL
                IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT.
              </p>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, SECURE, OR FREE FROM VIRUSES OR OTHER HARMFUL
              COMPONENTS, OR THAT METRIC AGGREGATIONS WILL ALWAYS BE 100%
              ACCURATE OR TIMELY.
            </p>
          </div>
        ),
      },
      {
        id: "section-12",
        title: "12. Limitation of Liability & Maximum Damage Caps",
        badge: "LIABILITY LIMITS",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL DRADIX
              TECHNOLOGIES INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, OR
              SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL,
              SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOSS OF
              PROFITS, DATA LOSS, BUSINESS INTERRUPTION, OR REPUTATIONAL DAMAGE)
              ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
            </p>

            <div className="bg-[#015451]/5 border border-[#015451]/20 rounded-2xl p-4 text-[#003c3a] space-y-1">
              <h5 className="text-xs font-bold text-[#015451]">
                Maximum Aggregate Liability Cap
              </h5>
              <p className="text-xs leading-relaxed text-[#003c3a]/90">
                DRADIX&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS OF ANY
                KIND RELATING TO THIS AGREEMENT SHALL NOT EXCEED THE GREATER OF:
                (A) ONE HUNDRED UNITED STATES DOLLARS ($100.00 USD), OR (B) THE
                TOTAL AMOUNT PAID BY YOU TO DRADIX IN THE TWELVE (12) MONTHS
                PRECEDING THE CLAIM.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "section-13",
        title: "13. Indemnification Obligations",
        badge: "INDEMNIFICATION",
        content: (
          <div className="space-y-3">
            <p className="text-zinc-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Dradix
              Technologies Inc., its affiliates, officers, directors, employees,
              and agents from and against any third-party claims, liabilities,
              damages, losses, costs, or expenses (including reasonable attorney
              fees) arising out of or related to:
            </p>
            <ul className="text-xs text-zinc-600 space-y-2.5 list-disc list-outside pl-4 leading-relaxed marker:text-[#015451]">
              <li>Your violation or breach of any provision of these Terms.</li>
              <li>
                Your user content, uploaded resumes, or code repository data.
              </li>
              <li>
                Your violation of any third-party right, including intellectual
                property or privacy rights.
              </li>
              <li>Your unauthorized or illegal use of the Dradix Service.</li>
            </ul>
          </div>
        ),
      },
      {
        id: "section-14",
        title: "14. Account Termination, Offboarding & Data Deletion",
        badge: "TERMINATION",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              You may terminate your Dradix account at any time through your
              Profile Settings or by submitting a written deletion request to{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-[#015451] font-bold underline"
              >
                {contactEmail}
              </a>
              .
            </p>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-zinc-900">
                Dradix Termination Rights
              </h5>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Dradix reserves the right to suspend or permanently terminate
                your account immediately, with or without prior notice, in the
                event of material breach of these Terms, non-payment, court
                order, or activities posing a security threat to our systems.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "section-15",
        title: "15. Dispute Resolution, Binding Arbitration & Class Waiver",
        badge: "DISPUTE RESOLUTION",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Please read this section carefully. It affects your legal rights,
              including your right to file a lawsuit in court.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Informal Dispute Resolution
                </strong>
                Prior to initiating arbitration, you and Dradix agree to attempt
                to resolve any dispute informally by contacting our legal team
                at{" "}
                <span className="text-[#015451] font-bold">{contactEmail}</span>{" "}
                for a 30-day negotiation period.
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Binding Individual Arbitration
                </strong>
                If unresolved informally, any dispute shall be finally settled
                under the Commercial Arbitration Rules of the American
                Arbitration Association (AAA). The arbitration shall be
                conducted in English on an individual basis.
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <strong className="text-zinc-900 font-semibold block mb-1">
                  Class Action & Jury Trial Waiver
                </strong>
                YOU AND DRADIX AGREE THAT EACH MAY BRING CLAIMS AGAINST THE
                OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A
                PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
                REPRESENTATIVE PROCEEDING.
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "section-16",
        title: "16. Miscellaneous, Amendments & Official Contact",
        badge: "MISCELLANEOUS",
        content: (
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              These Terms constitute the entire agreement between you and Dradix
              concerning the Service, superseding all prior oral or written
              agreements. If any provision of these Terms is held invalid by a
              court of competent jurisdiction, the remaining provisions shall
              remain in full force and effect.
            </p>

            <div className="bg-[#015451]/5 border border-[#015451]/20 rounded-2xl p-6 text-[#003c3a] space-y-3">
              <h4 className="font-bold text-sm text-[#015451]">
                Legal & Terms Inquiries Contact
              </h4>
              <p className="text-xs text-[#003c3a]/90 leading-relaxed">
                If you have any questions regarding these Terms of Service or
                need legal clarification, please contact our Legal Compliance
                Department:
              </p>
              <div className="pt-2 text-xs">
                <p>
                  <strong>Official Email:</strong>{" "}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-[#015451] font-bold underline"
                  >
                    {contactEmail}
                  </a>
                </p>
                <p className="mt-1">
                  <strong>Company:</strong> Dradix Technologies Inc.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [contactEmail],
  );

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (isClickScrollingRef.current) return;

      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting,
      );
      if (intersectingEntries.length > 0) {
        const topEntry = intersectingEntries.reduce((prev, curr) => {
          return Math.abs(curr.boundingClientRect.top) <
            Math.abs(prev.boundingClientRect.top)
            ? curr
            : prev;
        }, intersectingEntries[0]);
        setActiveSection(topEntry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [sections]);

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (sec) =>
          sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.badge.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sections;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-900 font-sans antialiased selection:bg-[#015451] selection:text-white">
      <header className="relative z-0 w-full overflow-hidden border-b border-zinc-800 text-white min-h-125 sm:min-h-150 md:min-h-170 flex flex-col justify-between">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/assets/images/TERMS-BG.png"
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-50"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>

        <Noise patternAlpha={18} />

        <nav className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between z-20 relative">
          <Link href="/" className="flex items-center group">
            <span className="font-heading font-bold text-xl text-white tracking-tight hover:text-[#38d39f] transition-colors">
              Dradix
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/"
              className="text-zinc-200 hover:text-white font-normal text-xs sm:text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="border border-white/25 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white font-normal text-xs sm:text-sm px-4 py-2 rounded-full transition-all backdrop-blur-md shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-white tracking-tight mb-6">
            Terms of Service
          </h1>

          <p className="text-zinc-200 text-base sm:text-md max-w-3xl mx-auto leading-relaxed font-normal mb-10">
            Comprehensive legal terms, acceptable use policies, developer
            platform license terms, and operational framework governing your use
            of Dradix.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs sm:text-xs text-zinc-300">
            <span className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-md">
              Last Updated: <strong className="text-white">July, 2026</strong>
            </span>
            <span className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-md">
              Official Email:{" "}
              <strong className="text-emerald-400 font-medium">
                {contactEmail}
              </strong>
            </span>
          </div>
        </div>
      </header>

      <div className="bg-zinc-100 min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms topics (e.g. Arbitration, License, Rate Limits)..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrint}
                className="bg-[#015451] hover:bg-[#003c3a] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FileTextIcon className="w-3.5 h-3.5" />
                <span>Print Terms</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-4 sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                  <span>Table of Contents</span>
                  <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
                    16 Sections
                  </span>
                </h3>

                <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin relative">
                  {sections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTocClick(sec.id);
                        }}
                        className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors duration-200 ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-normal"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-toc-indicator-terms"
                            transition={{
                              type: "spring",
                              stiffness: 550,
                              damping: 38,
                            }}
                            className="absolute inset-0 bg-[#015451] rounded-xl shadow-sm"
                          />
                        )}
                        <span className="truncate pr-2 relative z-10">
                          {sec.title}
                        </span>
                        <ChevronRightIcon
                          className={`w-3.5 h-3.5 shrink-0 relative z-10 transition-transform ${
                            isActive
                              ? "text-white translate-x-0.5"
                              : "text-zinc-400"
                          }`}
                        />
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div className="bg-linear-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-5 shadow-md border border-zinc-800 space-y-3">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                  Terms At A Glance
                </h4>
                <ul className="text-xs text-zinc-300 space-y-2 font-normal leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>
                      100% developer ownership over private source code.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>
                      Isolated AI inference with zero public model training.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Fair use API quotas & structured rate limits.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>14-day money-back refund on annual plans.</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Questions?</span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-8 space-y-6">
              {filteredSections.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200/80 shadow-xs space-y-3">
                  <h4 className="font-bold text-zinc-800 text-base">
                    No Matching Terms Sections
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    We couldn&apos;t find any terms matching &quot;
                    {searchQuery}&quot;. Try searching for
                    &quot;Arbitration&quot;, &quot;License&quot;, &quot;Rate
                    Limits&quot;, or &quot;AI&quot;.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs font-bold text-[#015451] hover:underline"
                  >
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                filteredSections.map((sec) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 sm:p-8 scroll-mt-8 transition-all hover:border-zinc-300"
                  >
                    <div className="border-b border-zinc-100 pb-4 mb-6">
                      <span className="text-[10px] font-bold text-[#015451] uppercase tracking-wider block mb-1">
                        {sec.badge}
                      </span>
                      <h2 className="font-bold text-xl sm:text-2xl text-zinc-900 tracking-tight">
                        {sec.title}
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm">{sec.content}</div>
                  </section>
                ))
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
