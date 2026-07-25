"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Noise from "@/components/Noise";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

interface Section {
  id: string;
  title: string;
  badge: string;
  content: React.ReactNode;
}

export default function PrivacyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeSection, setActiveSection] = useState("section-1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const contactEmail = "support@dradix.dev";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const sections: Section[] = [
    {
      id: "section-1",
      title: "1. Introduction & Core Commitment",
      badge: "OVERVIEW",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            Welcome to{" "}
            <strong className="text-zinc-900 font-semibold">Dradix</strong>{" "}
            (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Dradix is an
            AI-powered developer intelligence platform designed to unify git
            repositories, competitive programming metrics, developer activity,
            and career milestones into a verified developer identity and
            portfolio.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            We hold transparency and security as foundational pillars of our
            engineering culture. This Privacy Policy outlines how we collect,
            process, store, and protect your personal information, developer
            telemetry, and code metadata when you access our website, web app,
            and associated services (collectively, the &quot;Service&quot;).
          </p>
          <div className="bg-[#015451]/5 border border-[#015451]/20 rounded-2xl p-5 mt-4 text-[#003c3a] space-y-2">
            <h4 className="font-bold text-sm text-[#015451]">
              Our Fundamental Privacy Promise
            </h4>
            <p className="text-xs leading-relaxed text-[#003c3a]/90">
              We build tools for developers, by developers. We will{" "}
              <strong className="font-semibold text-zinc-900">
                never sell
              </strong>{" "}
              your personal data or private code metrics to third-party data
              brokers or advertisers. Your data remains strictly yours, used
              only to power your personalized Dradix experience.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "section-2",
      title: "2. Information We Collect",
      badge: "DATA SOURCES",
      content: (
        <div className="space-y-6">
          <p className="text-zinc-700 leading-relaxed">
            To provide accurate metric aggregation, AI insights, and custom
            showcase cards, Dradix collects data from the following explicit
            categories:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5">
              <h4 className="font-bold text-zinc-900 text-sm mb-2">
                Account & Identity Information
              </h4>
              <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Full name, display username, and email address (
                  <span className="text-[#015451] font-medium">
                    {contactEmail}
                  </span>{" "}
                  for account records).
                </li>
                <li>Profile avatar image URL and bio details.</li>
                <li>
                  Authentication credentials and OAuth access tokens
                  (encrypted).
                </li>
                <li>
                  User preferences, theme selections, and notification settings.
                </li>
              </ul>
            </div>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5">
              <h4 className="font-bold text-zinc-900 text-sm mb-2">
                Connected Developer Platforms
              </h4>
              <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>GitHub:</strong> Repository metadata, commit counts,
                  pull requests, language breakdowns, star counts, and
                  contribution calendar statistics.
                </li>
                <li>
                  <strong>Competitive Coding:</strong> LeetCode rating & problem
                  solved counts; Codeforces rank & contest rating history;
                  CodeChef badges.
                </li>
                <li>
                  <strong>Editor Telemetry:</strong> WakaTime daily coding hours
                  and language durations (if connected).
                </li>
              </ul>
            </div>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5">
              <h4 className="font-bold text-zinc-900 text-sm mb-2">
                AI Career Coach & Interactions
              </h4>
              <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>Prompts and questions submitted to the AI Career Coach.</li>
                <li>
                  Uploaded resume snippets or text formatted for AI feedback.
                </li>
                <li>
                  Generated career roadmaps and customized achievement
                  highlights.
                </li>
              </ul>
            </div>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5">
              <h4 className="font-bold text-zinc-900 text-sm mb-2">
                Technical & Device Telemetry
              </h4>
              <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  IP address, browser type, user-agent string, and operating
                  system.
                </li>
                <li>
                  Device resolution, referrer URL, and timestamped API access
                  logs.
                </li>
                <li>Session tokens and security cookies.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "section-3",
      title: "3. How We Use Your Information",
      badge: "PURPOSE",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            We process your information strictly to provide, improve, and secure
            the Dradix platform. Specific processing purposes include:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-zinc-200/70 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#015451]/10 text-[#015451] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                1
              </div>
              <div>
                <h5 className="text-xs font-bold text-zinc-900">
                  Developer Metrics & XP Score Calculation
                </h5>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Aggregating commit activity, competitive programming solved
                  counts, and coding hours to compute your overall developer XP,
                  skill radar, and recruiter readiness scores.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-zinc-200/70 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#015451]/10 text-[#015451] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                2
              </div>
              <div>
                <h5 className="text-xs font-bold text-zinc-900">
                  AI Portfolio Generation & Career Insights
                </h5>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Synthesizing raw platform stats into human-readable project
                  summaries, resume suggestions, and AI career guidance tailored
                  to your target tech stack.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-white rounded-xl border border-zinc-200/70 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#015451]/10 text-[#015451] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                3
              </div>
              <div>
                <h5 className="text-xs font-bold text-zinc-900">
                  Platform Security & Abuse Prevention
                </h5>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Monitoring API rates, preventing unauthorized access,
                  verifying OAuth callback state integrity, and maintaining
                  system stability.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 text-xs leading-relaxed mt-4">
            <strong className="font-bold text-amber-950 block mb-1">
              Strict AI Privacy Safeguard
            </strong>
            We do <strong className="font-semibold">NOT</strong> use your
            private repository source code, personal prompts, or resume inputs
            to train open public foundation models or shared AI datasets. All AI
            processing is performed statelessly via isolated enterprise API
            endpoints.
          </div>
        </div>
      ),
    },
    {
      id: "section-4",
      title: "4. Data Sharing & Non-Selling Policy",
      badge: "SHARING RULES",
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-950 text-white rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-base text-emerald-400">
              100% No-Sell Guarantee
            </h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Dradix does not sell, rent, monetize, or trade your personal data,
              developer profiles, or coding statistics to advertisers, data
              brokers, or market researchers under any circumstances.
            </p>
          </div>

          <p className="text-zinc-700 leading-relaxed text-xs sm:text-sm">
            We only share data in the following strictly limited operational
            scenarios:
          </p>

          <ul className="space-y-3 text-xs text-zinc-600">
            <li className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-0.5">
                Public Profiles (Your Choice):
              </strong>
              If you configure your Dradix Developer Profile as
              &quot;Public,&quot; designated metrics (such as GitHub stats,
              LeetCode ratings, and badge highlights) will be visible to
              external viewers and recruiters who hold your unique profile link.
              You can switch your profile to private at any time in Profile
              Settings.
            </li>
            <li className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-0.5">
                Trusted Infrastructure Service Providers:
              </strong>
              We partner with cloud infrastructure providers (e.g., database
              hosting, secure server hosting, and AI inference API gateways).
              These providers operate under strict confidentiality obligations
              and Data Processing Agreements (DPAs) that restrict them from
              using your data for any unauthorized purpose.
            </li>
            <li className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-0.5">
                Legal Compliance & Emergency Safety:
              </strong>
              We may disclose information if required by applicable law, search
              warrant, court subpoena, or when we reasonably believe disclosure
              is necessary to protect the rights, property, or safety of Dradix,
              our users, or the public.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "section-5",
      title: "5. Data Security & Storage Standards",
      badge: "SECURITY",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            We employ industry-leading technical, administrative, and physical
            security safeguards to protect your personal data against
            unauthorized access, destruction, loss, or alteration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center">
              <h5 className="text-xs font-bold text-zinc-900 mb-1">
                Encryption at Rest
              </h5>
              <p className="text-[11px] text-zinc-500">
                AES-256 standards applied to database records and token storage.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center">
              <h5 className="text-xs font-bold text-zinc-900 mb-1">
                Encryption in Transit
              </h5>
              <p className="text-[11px] text-zinc-500">
                TLS 1.3 protocol enforced across all web traffic and API
                endpoints.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center">
              <h5 className="text-xs font-bold text-zinc-900 mb-1">
                OAuth Token Isolation
              </h5>
              <p className="text-[11px] text-zinc-500">
                Encrypted secret management with minimal scope read permissions.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed mt-2">
            While no transmission over the Internet can be guaranteed 100%
            secure, we continuously audit our infrastructure, conduct
            vulnerability testing, and maintain least-privilege administrative
            access policies.
          </p>
        </div>
      ),
    },
    {
      id: "section-6",
      title: "6. Third-Party Integrations & Scope Revocation",
      badge: "INTEGRATIONS",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            Dradix connects to third-party developer platforms (such as GitHub,
            LeetCode, Codeforces, CodeChef, and WakaTime) to aggregate your
            stats into a unified identity.
          </p>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
            <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider text-[#015451]">
              How Permission Revocation Works
            </h5>
            <p className="text-xs text-zinc-600 leading-relaxed">
              You retain full control over all connected integrations. You can
              disconnect any platform integration at any time through your
              Dradix Profile settings, or directly revoke Dradix&apos;s OAuth
              authorization within the respective provider settings:
            </p>

            <ul className="text-xs text-zinc-600 space-y-2 list-disc list-inside pl-2">
              <li>
                <strong>GitHub OAuth:</strong> Revoke via{" "}
                <a
                  href="https://github.com/settings/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#015451] underline font-medium"
                >
                  GitHub Account Settings &gt; Applications
                </a>
                .
              </li>
              <li>
                <strong>Other Platforms:</strong> Unlink username in Dradix
                settings to instantly stop scheduled background metric polling.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "section-7",
      title: "7. Data Retention & Right to be Forgotten",
      badge: "RETENTION",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            We store your personal data and developer profile information only
            for as long as your account remains active or as needed to provide
            you with the Service.
          </p>

          <div className="bg-[#015451]/5 border border-[#015451]/20 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-[#015451]">
              Account Deletion SLA (Service Level Agreement)
            </h5>
            <p className="text-xs text-[#003c3a] leading-relaxed">
              Upon receiving your account deletion request (via profile settings
              or by contacting{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-bold underline"
              >
                {contactEmail}
              </a>
              ):
            </p>
            <ul className="text-xs text-[#003c3a]/90 space-y-1.5 list-disc list-inside">
              <li>
                Your profile access and public showcase page are immediately
                disabled.
              </li>
              <li>
                All stored OAuth access tokens and credentials are permanently
                destroyed within 48 hours.
              </li>
              <li>
                All cached repository metrics, competitive stats, and AI
                conversation logs are completely purged from our active
                databases within 30 days.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "section-8",
      title: "8. Your Privacy Rights & Choice Controls",
      badge: "YOUR RIGHTS",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            Depending on your geographic location (including the European Union
            under GDPR, United Kingdom, and California under CCPA/CPRA), you
            possess the following rights regarding your personal information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-1">
                Right of Access & Portability
              </strong>
              You have the right to request a copy of your personal data and
              developer metrics in a structured JSON format.
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-1">
                Right to Rectification
              </strong>
              You can modify or update inaccurate account information directly
              from your Dradix profile dashboard.
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-1">
                Right to Erasure (&quot;Right to be Forgotten&quot;)
              </strong>
              You can request complete deletion of your account and associated
              telemetry data at any time.
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <strong className="text-zinc-900 font-semibold block mb-1">
                Right to Restrict or Object
              </strong>
              You have the right to object to processing of specific platform
              integrations or non-essential communications.
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-2">
            To exercise any of these rights, please email our Privacy Response
            Team at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-[#015451] font-bold underline"
            >
              {contactEmail}
            </a>
            . We respond to all verified privacy rights requests within 48
            business hours.
          </p>
        </div>
      ),
    },
    {
      id: "section-9",
      title: "9. Cookies & Local Storage Technologies",
      badge: "COOKIES",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            Dradix uses cookies and browser local storage to maintain session
            state, authenticate users, and store display preferences (such as
            theme and sidebar state).
          </p>

          <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-900 font-bold">
                  <th className="p-3">Category</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-600">
                <tr>
                  <td className="p-3 font-semibold text-zinc-900">
                    Essential Cookies
                  </td>
                  <td className="p-3">
                    User authentication, session tokens, and security CSRF
                    protection.
                  </td>
                  <td className="p-3">Session / 30 Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-900">
                    Preference Storage
                  </td>
                  <td className="p-3">
                    Saving UI layout choices, theme mode, and sidebar collapse
                    state.
                  </td>
                  <td className="p-3">Persistent (Local Storage)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-900">
                    Performance Analytics
                  </td>
                  <td className="p-3">
                    Anonymous aggregation of page visit counts to diagnose slow
                    endpoints.
                  </td>
                  <td className="p-3">1 Year</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">
            You can configure your browser settings to reject or delete cookies,
            though certain core interactive features of the web application may
            require essential cookies to function properly.
          </p>
        </div>
      ),
    },
    {
      id: "section-10",
      title: "10. Children's Privacy Notice",
      badge: "CHILDREN",
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 leading-relaxed">
            Dradix is intended for developers, engineering students, and
            software professionals. Our Service is not directed to children
            under the age of 13 (or 16 in certain EU member states).
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed">
            We do not knowingly collect or solicit personal information from
            children under 13. If we become aware that we have collected
            personal data from a child under 13 without verified parental
            consent, we will take immediate steps to delete such information
            from our servers. If you believe a child under 13 has provided data
            to Dradix, please notify us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-[#015451] font-bold underline"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      id: "section-11",
      title: "11. International Data Transfers",
      badge: "GLOBAL DATA",
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 leading-relaxed">
            Dradix is hosted on secure cloud infrastructure located primarily in
            the United States and global edge nodes. If you are accessing our
            Service from outside the United States, please be aware that your
            information may be transferred to, stored, and processed in server
            facilities where our databases are located.
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed">
            We ensure appropriate cross-border data transfer safeguards are in
            place, including Standard Contractual Clauses (SCCs) and robust
            encryption standards compliant with international privacy
            guidelines.
          </p>
        </div>
      ),
    },
    {
      id: "section-12",
      title: "12. Policy Updates & Modifications",
      badge: "REVISIONS",
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 leading-relaxed">
            We may update this Privacy Policy periodically to reflect changes in
            our platform features, technology stack, legal requirements, or
            developer feedback.
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed">
            When material changes are made, we will update the &quot;Last
            Updated&quot; date at the top of this policy and provide prominent
            notice (such as an in-app banner or an email notification to
            registered accounts). We encourage you to review this policy
            periodically to stay informed about how Dradix protects your
            privacy.
          </p>
        </div>
      ),
    },
    {
      id: "section-13",
      title: "13. Contact Us & Support Details",
      badge: "CONTACT",
      content: (
        <div className="space-y-4">
          <p className="text-zinc-700 leading-relaxed">
            If you have any questions, concerns, feedback, or privacy rights
            requests regarding this Privacy Policy or Dradix&apos;s data
            practices, please reach out directly to our Data Protection &
            Privacy Team:
          </p>

          <div className="bg-[#015451]/5 border border-[#015451]/20 rounded-2xl p-6 text-[#003c3a] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#015451] block mb-1">
                  Official Privacy Contact Email
                </span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-lg sm:text-xl font-bold text-[#015451] hover:underline"
                >
                  {contactEmail}
                </a>
              </div>

              <button
                onClick={handleCopyEmail}
                className="bg-[#015451] hover:bg-[#003c3a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 self-start sm:self-center cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-[#015451]/15 text-xs text-[#003c3a]/80 space-y-1">
              <p>
                <strong>Response SLA:</strong> We respond to all inquiries
                within 48 business hours.
              </p>
              <p>
                <strong>Subject Line Hint:</strong> Include &quot;[Privacy
                Inquiry]&quot; or &quot;[Data Request]&quot; for prioritized
                processing.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
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

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (sec) =>
          sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.badge.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sections;

  const faqs = [
    {
      q: "Does Dradix read or store my private repository source code?",
      a: "No. Dradix only requests read access to commit metadata, language contribution stats, and aggregate repository metrics needed to generate developer scores and portfolio highlights. We do not store or copy your raw source code files.",
    },
    {
      q: "How do I disconnect GitHub or other competitive profiles?",
      a: "You can disconnect any integration instantly in your Dradix Account Profile settings. Disconnecting an integration stops background synchronization and removes cached platform metrics.",
    },
    {
      q: "Can recruiters see my private projects without permission?",
      a: "No. Your profile visibility defaults to your preference. Even on public profile showcases, private repository names and confidential details are anonymized or masked unless explicitly set to public showcase.",
    },
    {
      q: "How do I request complete deletion of my account data?",
      a: "You can delete your account via Profile Settings or by emailing support@dradix.dev. All associated database records, tokens, and telemetry are permanently purged within 30 days.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-900 font-sans antialiased selection:bg-[#015451] selection:text-white">
      <header className="relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-800 text-white min-h-[540px] sm:min-h-[640px] md:min-h-[700px] flex flex-col justify-between">
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <Image
            src="/assets/images/HERO-BG.png"
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-90 contrast-85 scale-105"
          />
        </div>

        <Noise patternAlpha={22} />

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
            Privacy Policy
          </h1>

          <p className="text-zinc-200 text-base sm:text-md max-w-3xl mx-auto leading-relaxed font-normal mb-10">
            Complete transparency regarding how Dradix collects, protects,
            processes, and respects your developer data, code activity, and
            personal information.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs sm:text-xs text-zinc-300">
            <span className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-md">
              Last Updated:{" "}
              <strong className="text-white">July 25, 2026</strong>
            </span>
            <span className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl backdrop-blur-md">
              Version: <strong className="text-white">1.4 (Current)</strong>
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
                placeholder="Search privacy topics (e.g. GitHub, Cookies, Delete)..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyEmail}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-zinc-200/90 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Copy Official Support Email"
              >
                {copiedEmail ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="bg-[#015451] hover:bg-[#003c3a] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FileTextIcon className="w-3.5 h-3.5" />
                <span>Print Policy</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-4 sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                  <span>Table of Contents</span>
                  <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
                    13 Sections
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
                          setActiveSection(sec.id);
                          document
                            .getElementById(sec.id)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors duration-200 ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-normal"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-toc-indicator"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 32,
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

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-5 shadow-md border border-zinc-800 space-y-3">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                  Privacy At A Glance
                </h4>
                <ul className="text-xs text-zinc-300 space-y-2 font-normal leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Zero selling of personal data or code metrics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>
                      Private AI processing with zero public model training.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>
                      Complete control over public vs private profile
                      visibility.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>
                      Instant account deletion & 30-day permanent purge SLA.
                    </span>
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
                    No Matching Policy Sections
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    We couldn&apos;t find any privacy topics matching &quot;
                    {searchQuery}&quot;. Try searching for &quot;GitHub&quot;,
                    &quot;Cookies&quot;, &quot;Delete&quot;, or &quot;AI&quot;.
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

                    {sec.content}
                  </section>
                ))
              )}

              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 sm:p-8 mt-10">
                <div className="mb-6 pb-4 border-b border-zinc-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    FAQ
                  </span>
                  <h3 className="font-bold text-xl text-zinc-900">
                    Frequently Asked Privacy Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-zinc-200/80 rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-bold text-xs sm:text-sm text-zinc-900 bg-zinc-50/50 hover:bg-zinc-50 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                              isOpen ? "rotate-180 text-[#015451]" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="p-4 text-xs text-zinc-600 bg-white border-t border-zinc-100 leading-relaxed overflow-hidden"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl border border-zinc-800">
                <h3 className="text-2xl sm:text-3xl font-bold font-heading">
                  Have Questions About Your Data Privacy?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-normal">
                  Our Data Protection Officer and Privacy Support engineering
                  team are here to assist with any questions or requests.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="bg-[#015451] hover:bg-[#003c3a] text-white text-xs font-bold px-7 py-3.5 rounded-full transition-all shadow-md active:scale-95"
                  >
                    Contact {contactEmail}
                  </a>
                  <Link
                    href="/dashboard"
                    className="text-xs text-zinc-300 hover:text-white font-semibold underline underline-offset-4"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-heading font-bold text-lg text-white">
              Dradix
            </div>
            <p className="text-zinc-500 text-[11px]">
              AI-powered developer intelligence & unified career portfolio
              platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/privacy"
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className="hover:text-white transition-colors"
            >
              Support ({contactEmail})
            </a>
          </div>

          <div className="text-zinc-500 text-[11px] text-center md:text-right">
            &copy; {new Date().getFullYear()} Dradix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
