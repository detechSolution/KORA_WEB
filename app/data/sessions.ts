export type SessionDetail = {
  id: number;
  slug: string;
  title: string;
  category: string;
  tagLabel: string;
  date: string;
  dateIso: string;
  image: string;
  description: string;
  time: string;
  spots: string;
  spotsRemaining: number;
  price: string;
  duration: string;
  facilitator: string;
  location: string;
  bookingWindow: string;
  overview: string[];
  expectations: string[];
  facilitatorBio: string;
  supportImage?: string;
};

export const sessions: SessionDetail[] = [
  {
    id: 1,
    slug: "afternoon-stretch",
    title: "Afternoon Stretch",
    category: "classes",
    tagLabel: "CLASS",
    date: "MAY 22, 2026",
    dateIso: "2026-05-22",
    image: "/images/session/afternoon_stretch.png",
    supportImage: "/images/hero/experience_steam.png",
    description:
      "A guided gentle flow session suitable for all levels, focusing on flexibility, core stability, and deep breathwork for physical relaxation.",
    time: "12:00 PM - 01:00 PM",
    spots: "12 seats left",
    spotsRemaining: 12,
    price: "Rs. 1,900",
    duration: "60 minutes",
    facilitator: "Anika Sharma",
    location: "Kora Movement Studio",
    bookingWindow: "Arrive 10 minutes before class",
    overview: [
      "Ease into the afternoon with guided mobility, grounding breathwork, and slow transitions that release accumulated desk and commute tension.",
      "The class is paced to help both first-time guests and returning members reset posture, reconnect with breath, and leave feeling lighter through the shoulders, hips, and spine.",
    ],
    expectations: [
      "Deep full-body stretching with gentle instructor cues",
      "Breath-led mobility work for shoulders, hips, and lower back",
      "A calm, no-pressure format that welcomes all levels",
      "Post-class hydration and recovery recommendations",
    ],
    facilitatorBio:
      "Anika blends restorative yoga with mobility-focused coaching. Her classes are known for patient guidance, practical alignment cues, and a welcoming rhythm that helps guests unwind without feeling intimidated.",
  },
  {
    id: 2,
    slug: "meditation-101",
    title: "Meditation 101",
    category: "classes",
    tagLabel: "CLASS",
    date: "MAY 23, 2026",
    dateIso: "2026-05-23",
    image: "/images/session/meditation.png",
    supportImage: "/images/hero/manifesto_meditation.png",
    description:
      "Beginner-friendly mindfulness meditation session focusing on breathwork, concentration, and cultivating inner peace through guided visual and silent meditation.",
    time: "08:00 AM - 09:00 AM",
    spots: "15 seats left",
    spotsRemaining: 15,
    price: "Rs. 1,900",
    duration: "60 minutes",
    facilitator: "Sanjay Maharjan",
    location: "Kora Quiet Room",
    bookingWindow: "Doors close 5 minutes after start time",
    overview: [
      "Meditation 101 introduces a simple and approachable framework for building a steady mindfulness practice, even if you have never meditated before.",
      "We begin with posture and breath awareness, then gradually layer in concentration, body scanning, and a short silent sit so guests can experience stillness without pressure.",
    ],
    expectations: [
      "Foundations of seated posture and intentional breathing",
      "Guided techniques to calm distraction and mental noise",
      "Short silent practice blocks with supportive prompts",
      "Take-home suggestions for a realistic daily practice",
    ],
    facilitatorBio:
      "Sanjay teaches meditation with warmth and precision, helping new practitioners understand what to do when the mind wanders rather than treating it like failure. His sessions are structured, gentle, and highly accessible.",
  },
  {
    id: 3,
    slug: "sound-healing",
    title: "Sound Healing",
    category: "events",
    tagLabel: "WORKSHOP",
    date: "MAY 25, 2026",
    dateIso: "2026-05-25",
    image: "/images/session/sound_healing.png",
    supportImage: "/images/hero/manifesto_singing.png",
    description:
      "Immersive acoustic sound bath session incorporating brass singing bowls, crystal chimes, and gongs to induce deep state of meditation and physical restoration.",
    time: "05:00 PM - 06:00 PM",
    spots: "8 seats left",
    spotsRemaining: 8,
    price: "Rs. 1,900",
    duration: "60 minutes",
    facilitator: "Maya Chen",
    location: "Square Hotel",
    bookingWindow: "Please arrive 15 minutes early for setup",
    overview: [
      "Sound Healing is a therapeutic practice that uses vibrations from instruments such as singing bowls, gongs, and tuning forks to promote relaxation, balance, and overall well-being.",
      "These soothing frequencies work gently on the body and mind, helping to release tension, calm the nervous system, and restore a natural state of harmony. During a session, participants are invited to simply lie down, breathe deeply, and allow the sound waves to wash over them, creating a meditative and restorative experience.",
    ],
    expectations: [
      "Deep relaxation and stress reduction",
      "Gentle balancing of mind and body",
      "Enhanced focus and mental clarity",
      "Support for emotional release and inner calm",
      "A peaceful, meditative environment suitable for all experience levels",
    ],
    facilitatorBio:
      "Maya Chen brings a thoughtful and energetic approach to every sound experience, combining technical expertise with a strong focus on flow, rhythm, and guest comfort. With experience in training style and specialty instrumentation, she is dedicated to helping individuals build strength, improve mobility, and feel more confident in their movement while creating an environment where progress feels natural and sustainable.",
  },
  {
    id: 4,
    slug: "stone-healing",
    title: "Stone Healing",
    category: "workshops",
    tagLabel: "CLASS",
    date: "MAY 28, 2026",
    dateIso: "2026-05-28",
    image: "/images/session/stone_healing.png",
    supportImage: "/images/hero/manifesto_crystals.png",
    description:
      "A premium heated basalt stone massage and therapeutic bodywork session designed to melt away muscle tension, improve circulation, and soothe nervous system.",
    time: "03:00 PM - 04:30 PM",
    spots: "5 seats left",
    spotsRemaining: 5,
    price: "Rs. 1,910",
    duration: "90 minutes",
    facilitator: "Ritika Thapa",
    location: "Kora Recovery Suite",
    bookingWindow: "Consultation begins 10 minutes before the session",
    overview: [
      "Stone Healing combines warmed basalt stones with slow therapeutic bodywork to soften muscular tension and encourage a deeper parasympathetic reset.",
      "The treatment is designed for guests who want a more grounded, body-led recovery experience with attention to circulation, nervous system down-regulation, and sustained warmth.",
    ],
    expectations: [
      "Heated stone placement to release tight muscle groups",
      "Slow bodywork focused on shoulders, back, and legs",
      "A premium recovery format with individualized pacing",
      "Post-session recommendations for rest and hydration",
    ],
    facilitatorBio:
      "Ritika specializes in restorative touch therapies and premium recovery rituals. She works with deliberate pace and careful pressure adjustments, creating sessions that feel luxurious while staying deeply therapeutic.",
  },
];

export const sessionCollection = {
  data: sessions,
  meta: {
    total: sessions.length,
  },
};

export const getSessionBySlug = (slug: string) =>
  sessions.find((session) => session.slug === slug);
