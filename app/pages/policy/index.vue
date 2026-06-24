<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Terms & Policy",
  description:
    "By accessing or using Kora's services, guests agree to our terms, which are designed to ensure a safe, respectful, and seamless experience for everyone.",
});
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full min-h-screen py-12 overflow-hidden"
  >
    <!-- Premium absolute-positioned foliage watermark overlay (Left) -->
    <div
      class="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage left"
        class="w-full h-full object-cover scale-x-[-1] -translate-x-12 -translate-y-12 rotate-12"
      >
    </div>

    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-100000 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover translate-x-12 -translate-y-12 -rotate-12"
      >
    </div>

    <div class="relative z-20 mx-auto px-4 md:px-8">
      <div class="border-b border-border text-center space-y-8 pb-16">
        <h1
          class="font-serif text-3xl md:text-5xl lg:text-6xl text-secondary dark:text-white font-normal tracking-wide"
        >
          KORA Wellness Sanctuary:<br>Terms and Conditions
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-4xl mx-auto"
        >
          At KORA Kathmandu, we want to curate an environment that is welcoming, mindful, egoless,
          growth-oriented, and free from unnecessary outside disturbance. It is important to us that all
          members are able to progress in their health and wellness journey by behaving in a manner that
          is respectful of all individuals within the KORA premises. Be aware that KORA is not a place to
          conduct personal business that involves solicitation of any kind. Members should be free to
          enjoy the facility to train, eat, recover, and engage in mutually beneficial discussions. To provide
          a professional level of service, we kindly ask that you follow our code of conduct, available to
          you within our Terms and Conditions.
        </p>
      </div>

      <div class="max-w-400 md:px-6 mx-auto py-24">
        <div class="space-y-8">
          <!-- 1. Passes and Memberships -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              1. Passes and Memberships
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Please note that all Memberships/Workshops/Special Events/Camps/Retreats are paid upfront and are non-refundable, non-modifiable, and non-transferable. You can upgrade your membership within 2 days from the purchase date. By renewing your membership, you agree to the membership terms that apply at that time. Day passes and Basic Memberships do not include Special Events, Workshops, Retreats, and Camps.
            </p>
          </div>

          <!-- 2. Promotions/Complimentary -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              2. Promotions/Complimentary
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              All promotional memberships and Day packages are non-refundable, non-transferable, and non-modifiable. Promotional memberships purchased in advance can be activated within 30–60 days from the purchase date. Members of KORA are provided with a discount at NUAD THAI Spa and Cafe NORI for Spa, Food and Beverage purposes. Sharing of said benefits is not acceptable, whether to another member or a guest until mentioned in the membership deeds.
            </p>
          </div>

          <!-- 3. Operating Days & Hours -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              3. Operating Days &amp; Hours
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Hours of operations: 4:30:00 AM – 9:00 PM, all week. KORA Kathmandu reserves the right to change operation hours without prior notice.
            </p>
          </div>

          <!-- 4. Time Freeze -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              4. Time Freeze
            </h3>
            <div class="space-y-4">
              <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
                <strong>Medical Freeze:</strong> Must provide a legal Doctor’s certificate from a General Practitioner or Hospital in Kathmandu. The certificate must provide the name, contact number, doctor details, health concern, and recommended rest time. Online health/doctor applications are not acceptable.
              </p>
              <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
                <strong>Travel Freeze:</strong> Allowed with proof of flight tickets (1 week maximum). We are unable to backdate freeze requests; they must be requested in advance.
              </p>
            </div>
          </div>

          <!-- 5. No Membership Transfer is Allowed -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              5. No Membership Transfer is Allowed
            </h3>
          </div>

          <!-- 6. Class Attendance and No-Show Policy -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              6. Class Attendance and No-Show Policy
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              You must arrive at least 15 minutes before the class starts to avoid losing your spot. All classes start on time; late arrivals will not be permitted. The waiting list opens 15 minutes before the class starts. Booking is allowed a maximum of 7 days in advance.
            </p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              <li><strong>First Offence:</strong> A warning and friendly reminder.</li>
              <li><strong>Second Offence:</strong> 3-day restriction from making online or advance bookings.</li>
              <li><strong>Third Offence:</strong> A strict penalty of NPR 500 fine. Online bookings remain disabled until the fine is paid.</li>
            </ul>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              <strong>Cancellation:</strong> You must cancel your booking 10 hours from the app or inform the front office at least 10 hours before the class starts. Failure to do so results in a "No-Show" status. Non-members must pay in advance (non-refundable) but can move a booking once if informed 10 hours in advance.
            </p>
          </div>

          <!-- 7. Class Priority -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              7. Class Priority
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              All classes take priority on space. Please refer to schedules and corresponding areas.
            </p>
          </div>

          <!-- 8. Personal Conduct -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              8. Personal Conduct
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Please wear comfortable, appropriate clothes and footwear. We are not responsible for personal injury due to misuse of equipment. Be mindful of body odor. Use and return sweat towels provided.
            </p>
          </div>

          <!-- 9. Conducting Business -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              9. Conducting Business
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Professional trainers and coaches are not allowed to practice their trade or carry out tuition for reward at the facility without prior written permission. Only KORA trainers can train members. The club reserves the right to cancel memberships for unauthorized training without a refund.
            </p>
          </div>

          <!-- 10. Respecting Our Equipment -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              10. Respecting Our Equipment
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Members use facilities at their own risk. Please ask staff if unsure how to operate equipment. You are responsible for damages caused by negligence. Return mobile equipment to its place and wipe down gear after use.
            </p>
          </div>

          <!-- 11. Keeping Your Belongings Safe -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              11. Keeping Your Belongings Safe
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Lockers are provided for use while exercising. KORA Kathmandu is not responsible for any loss of personal belongings. Belongings left overnight may be removed. Lost items are kept for a maximum of 1 month.
            </p>
          </div>

          <!-- 12. Seeking Medical Advice -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              12. Seeking Medical Advice
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Our staff are not medically trained. We strongly urge you to seek expert medical advice before starting an exercise program. KORA recommends all members have personal health insurance.
            </p>
          </div>

          <!-- 13. Respecting Others -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              13. Respecting Others
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Inappropriate behavior (intimidation, harassment, discrimination, use of speakerphone, or taking photos/videos of others without consent) is strictly prohibited.
            </p>
          </div>

          <!-- 14. Prohibited Activities -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              14. Prohibited Activities
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Alcohol, drugs (including steroids), and smoking are prohibited. No weapons allowed. Outside food and drink are not permitted in the KORA facility. Laptops and tablets are prohibited in exercise areas for safety.
            </p>
          </div>

          <!-- 15. Content Creation -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              15. Content Creation
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              No tripods are allowed before 6:00 PM; professional cameras are prohibited unless pre-approved by management (fees may apply). Content created on KORA time or using KORA equipment is owned by KORA. We may use photos/videos taken in the sanctuary; please inform us if you wish to be excluded.
            </p>
          </div>

          <!-- 16. Pets & Animals -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              16. Pets &amp; Animals
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Pets or animals of any kind are not allowed at KORA Kathmandu.
            </p>
          </div>

          <!-- 17. Age Limit -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              17. Age Limit
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              No children are allowed in the workout area. The minimum age to use our facilities is 16 years old or allowed under Parents supervision.
            </p>
          </div>

          <!-- 18. Code Violations -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              18. Code Violations
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              KORA Kathmandu reserves the right to deny access or cancel memberships for those who refuse to comply with sanctuary rules.
            </p>
          </div>

          <!-- 19. Instant Cancellation -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              19. Instant Cancellation
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Membership may be canceled without warning for:
            </p>
            <ul class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              <li>Threatening or harassing others</li>
              <li>Damaging equipment</li>
              <li>Using illegal drugs</li>
              <li>Unauthorized instruction of other members</li>
            </ul>
          </div>

          <!-- 20. Liability -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              20. Liability
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              KORA Kathmandu will not be responsible for any injury, death, or loss sustained in the facility. Exercise beyond one's physical limits may result in serious injury; participation is at your own risk.
            </p>
          </div>

          <!-- 21. Handling Complaints -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              21. Handling Complaints
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Submit complaints to info@koranepal.com. We aim to respond within 48 hours.
            </p>
          </div>

          <!-- 22. Food and Beverages -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              22. Food and Beverages
            </h3>
            <ul class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              <li>Members (4 weeks+) receive a discount at Cafe NORI.</li>
              <li>T-shirts are required in the cafe. No external food/drink.</li>
              <li>No phone calls in dining venues or quiet spaces.</li>
              <li>We use cash/card/E-wallet; no credits allowed.</li>
            </ul>
          </div>

          <!-- 23. Membership Data -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              23. Membership Data
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Members agree to share personal information required for the gym information system.
            </p>
          </div>

          <!-- Personal Training Addendum -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Personal Training Addendum
            </h3>
            <ul class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              <li><strong>Purchasing &amp; Payments:</strong> Sessions must be paid in full prior to undertaking them.</li>
              <li><strong>Cancellations:</strong> 24-hour notice is required. If canceled with less than 12 hours' notice, the session is forfeited.</li>
              <li><strong>Lateness:</strong> If a trainer is &gt;15 mins late, you get a complimentary session. If you are &gt;15 mins late, the trainer may cancel the session with no refund.</li>
              <li><strong>Expiry:</strong> 1 session (1 week), 5 pack (4 weeks), 10 pack (6 weeks), 20 pack (12 weeks).</li>
              <li><strong>Refunds:</strong> Only granted for critical medical reasons with General Manager approval.</li>
            </ul>
          </div>

          <!-- Agreement of Release & Waiver of Liability -->
          <div class="flex flex-col gap-6 pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Agreement of Release &amp; Waiver of Liability
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              I acknowledge that any information or training I receive at KORA Wellness Sanctuary is the property of KORA and should not be taught elsewhere without express permission. I understand I must be a KORA certified instructor to teach specialized methods. By acknowledging this agreement, I warrant that I am in good physical health and have no medical condition, disability, or injury that would restrict their participation in KORA rituals. I acknowledge that KORA staff are not medically trained and that it is mine’s sole responsibility to seek medical clearance before beginning any exercise or recovery program.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
