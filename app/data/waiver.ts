export type WaiverSection = {
  heading: string;
  paragraphs: string[];
};

export const WAIVER = {
  title: "Medical & Liability Waiver",
  documentName: "KORA — Digital Medical & Liability Waiver",
  governingLaw:
    "This is a binding legal agreement governed by the laws of Nepal (Muluki Dewani Samhita 2074). Please read carefully before acknowledging.",
  sections: [
    {
      heading: "1. Voluntary Assumption of Inherent Risks",
      paragraphs: [
        "I, the undersigned participant, voluntarily elect to enter KORA Sanctuary and utilize its facilities, including but not limited to movement space, strength space, flow space and recovery space. I explicitly acknowledge that thermal therapy (extreme heat and cold exposure) and physical movement carry inherent risks, including heat exhaustion, hyperthermia, hypothermia, sudden cardiovascular stress, blood pressure changes, physical slips/falls, and thermal shock. I freely assume full responsibility for all known and unknown risks associated with my participation.",
      ],
    },
    {
      heading: "2. Medical Fitness, Contraindications & Disclosure",
      paragraphs: [
        "I certify that I am in sound physical and mental health. I confirm I do not suffer from unmanaged cardiovascular disease, acute hypertension, epilepsy, respiratory conditions, active infections, open wounds, or conditions exacerbated by extreme temperatures. I confirm I am not pregnant (unless cleared by a physician for specific modalities) and am not under the influence of alcohol, narcotics, or performance-impairing substances. I acknowledge that KORA staff are not medical professionals and cannot provide medical diagnosis or advice.",
      ],
    },
    {
      heading: "3. Sanctuary Privacy & Media Recording",
      paragraphs: [
        "To protect the privacy, tranquility, and safety of all members and high-profile guests, I agree to strictly adhere to KORA's privacy standards. Recording digital media, photography, or video capturing other members or staff without explicit, written prior consent is strictly prohibited across all thermal, pool, movement, and locker room zones. Smart wearables with recording capabilities are prohibited in private zones. KORA reserves the right to immediately terminate access for privacy breaches.",
      ],
    },
    {
      heading: "4. Property Loss & Damage Indemnification",
      paragraphs: [
        "KORA accepts no liability for lost, stolen, or damaged personal belongings. I agree to hold KORA harmless for any loss of personal items brought onto the premises. Furthermore, I agree to accept full financial responsibility for any physical damage caused to KORA's custom architectural fixtures, equipment, or amenities resulting from my willful misconduct, recklessness, or negligence.",
      ],
    },
    {
      heading: "5. Emergency Medical Authorization & Cost Responsibility",
      paragraphs: [
        "In the event of a medical emergency, acute injury, or physiological distress, I authorize KORA management and certified first responders to administer emergency first aid, CPR/AED protocols, and arrange immediate transport to an appropriate nearest medical facility. I agree to bear total financial responsibility for all medical transport, emergency care, and hospital fees incurred.",
      ],
    },
    {
      heading: "6. Release of Liability & Severability",
      paragraphs: [
        "To the maximum extent permitted under Nepalese law, I release, waive, and forever discharge KORA (operated under Sam's Fitness Pvt. Ltd.), its officers, directors, employees, contractors, and non-profit partners from any and all claims, liabilities, or demands arising from ordinary negligence or standard facility usage. If any provision of this waiver is declared invalid or unenforceable by a court of law, all remaining provisions shall remain in full legal force and effect.",
      ],
    },
  ] as WaiverSection[],
  acceptance: "I have read, understood, and voluntarily agree to all terms above.",
} as const;
