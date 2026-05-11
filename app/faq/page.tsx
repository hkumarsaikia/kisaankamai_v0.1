"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { supportContact } from "@/lib/support-contact";

interface FAQItem {
  questionKey:
    | "faq.how_do_i_book_a_tractor_or_harvester"
    | "faq.are_there_any_transport_charges"
    | "faq.can_i_cancel_a_booking"
    | "faq.how_much_does_it_cost_to_list_my_tractor"
    | "faq.what_documents_do_i_need_to_list"
    | "faq.can_i_pay_after_the_work_is_done"
    | "faq.what_payment_methods_do_you_accept"
    | "faq.how_do_you_verify_equipment_owners"
    | "faq.is_my_payment_safe";
  answerKey:
    | "faq.how_do_i_book_a_tractor_or_harvester_answer"
    | "faq.are_there_any_transport_charges_answer"
    | "faq.can_i_cancel_a_booking_answer"
    | "faq.how_much_does_it_cost_to_list_my_tractor_answer"
    | "faq.what_documents_do_i_need_to_list_answer"
    | "faq.can_i_pay_after_the_work_is_done_answer"
    | "faq.what_payment_methods_do_you_accept_answer"
    | "faq.how_do_you_verify_equipment_owners_answer"
    | "faq.is_my_payment_safe_answer";
}

function FAQAccordion({ item, color }: { item: FAQItem; color: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <div className="bg-surface-container-lowest dark:bg-slate-900/40 rounded-xl border border-outline-variant dark:border-slate-800/50 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full p-6 flex justify-between items-center cursor-pointer hover:bg-surface-container-low dark:hover:bg-slate-900/50 transition-colors group text-left">
        <div className="flex-1 pr-4">
          <h3 className="font-bold text-lg text-on-surface dark:text-emerald-50">{t(item.questionKey)}</h3>
        </div>
        <span className={`material-symbols-outlined ${color} transition-transform ${open ? "rotate-180" : ""}`}>expand_more</span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-on-surface-variant dark:text-slate-300 border-t border-slate-50 dark:border-slate-800/50 pt-4 bg-white/50 dark:bg-slate-950/30">
          <p>{t(item.answerKey)}</p>
        </div>
      )}
    </div>
  );
}

const rentingFAQs: FAQItem[] = [
  { questionKey: "faq.how_do_i_book_a_tractor_or_harvester", answerKey: "faq.how_do_i_book_a_tractor_or_harvester_answer" },
  { questionKey: "faq.are_there_any_transport_charges", answerKey: "faq.are_there_any_transport_charges_answer" },
  { questionKey: "faq.can_i_cancel_a_booking", answerKey: "faq.can_i_cancel_a_booking_answer" },
];

const listingFAQs: FAQItem[] = [
  { questionKey: "faq.how_much_does_it_cost_to_list_my_tractor", answerKey: "faq.how_much_does_it_cost_to_list_my_tractor_answer" },
  { questionKey: "faq.what_documents_do_i_need_to_list", answerKey: "faq.what_documents_do_i_need_to_list_answer" },
];

const paymentFAQs: FAQItem[] = [
  { questionKey: "faq.can_i_pay_after_the_work_is_done", answerKey: "faq.can_i_pay_after_the_work_is_done_answer" },
  { questionKey: "faq.what_payment_methods_do_you_accept", answerKey: "faq.what_payment_methods_do_you_accept_answer" },
];

const trustFAQs: FAQItem[] = [
  { questionKey: "faq.how_do_you_verify_equipment_owners", answerKey: "faq.how_do_you_verify_equipment_owners_answer" },
  { questionKey: "faq.is_my_payment_safe", answerKey: "faq.is_my_payment_safe_answer" },
];

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <main className="flex-grow pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-emerald-50 mb-4 tracking-tight">{t("faq.how_can_we_help_you")}</h1>
            <p className="text-lg text-on-surface-variant dark:text-slate-400 font-medium">{t("faq.find_answers_to_common_questions_about_renting_and_listing_on_kisan_kamai")}</p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Renting */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-primary-fixed dark:border-slate-700">
                <span className="material-symbols-outlined text-primary dark:text-emerald-400 text-3xl">shopping_cart</span>
                <div>
                  <h2 className="text-2xl font-bold text-primary dark:text-emerald-50">{t("faq.renting_equipment")}</h2>
                </div>
              </div>
              {rentingFAQs.map((faq) => <FAQAccordion key={faq.questionKey} item={faq} color="text-primary dark:text-emerald-400" />)}
            </section>

            {/* Listing */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-secondary-fixed dark:border-amber-800">
                <span className="material-symbols-outlined text-secondary dark:text-amber-400 text-3xl">sell</span>
                <div>
                  <h2 className="text-2xl font-bold text-secondary dark:text-amber-400">{t("faq.listing_equipment")}</h2>
                </div>
              </div>
              {listingFAQs.map((faq) => <FAQAccordion key={faq.questionKey} item={faq} color="text-secondary dark:text-amber-400" />)}
            </section>

            {/* Booking & Payment */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-tertiary-fixed dark:border-amber-700">
                <span className="material-symbols-outlined text-tertiary-container dark:text-amber-500 text-3xl">payments</span>
                <div>
                  <h2 className="text-2xl font-bold text-tertiary dark:text-amber-300">{t("faq.booking_and_payment")}</h2>
                </div>
              </div>
              {paymentFAQs.map((faq) => <FAQAccordion key={faq.questionKey} item={faq} color="text-tertiary-container dark:text-amber-500" />)}
            </section>

            {/* Trust & Safety */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-outline dark:border-slate-800">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-3xl">verified_user</span>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface dark:text-emerald-50">{t("faq.trust_and_safety")}</h2>
                </div>
              </div>
              {trustFAQs.map((faq) => <FAQAccordion key={faq.questionKey} item={faq} color="text-on-surface-variant dark:text-slate-400" />)}
            </section>
          </div>

          {/* Contact CTA */}
          <div className="mt-24 p-8 md:p-12 bg-primary-container rounded-3xl relative overflow-hidden">
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("faq.still_have_questions")}</h2>
              <p className="text-primary-fixed text-lg mb-8">{t("faq.our_team_is_ready_to_help_you_find_the_right_equipment_or_help_you_list_your_own")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={supportContact.phoneHref}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors dark:bg-slate-950 dark:text-emerald-100 dark:hover:bg-slate-900"
                >
                  <span className="material-symbols-outlined">call</span>
                  {t("faq.call_support")}
                </a>
                <a
                  href={supportContact.whatsappHref}
                  className="w-full sm:w-auto px-8 py-4 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity dark:bg-secondary-container dark:text-on-secondary-container dark:hover:bg-secondary-container/90"
                >
                  <span className="material-symbols-outlined">chat</span>
                  {t("faq.whatsapp_us")}
                </a>
              </div>
              <p className="mt-6 text-white/80 font-semibold font-mukta">{supportContact.phoneDisplay}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
