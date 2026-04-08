import { buildWhatsappLink } from "@/lib/utils";
import { SiteContent } from "@/types/site";

interface FloatingContactButtonsProps {
  siteContent: SiteContent;
}

export function FloatingContactButtons({
  siteContent,
}: FloatingContactButtonsProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 sm:bottom-5 sm:right-5 sm:gap-3">
      <a
        href={siteContent.facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1877f2] text-base font-black text-white shadow-[0_18px_40px_rgba(24,119,242,0.26)] sm:h-12 sm:w-12 sm:text-lg"
        aria-label="Visit FreshBitan Facebook page"
      >
        f
      </a>
      <a
        href={buildWhatsappLink(
          siteContent.whatsappNumber,
          siteContent.whatsappMessage,
        )}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-lg font-black text-white shadow-[0_18px_40px_rgba(37,211,102,0.3)] sm:h-14 sm:w-14 sm:text-xl"
        aria-label="Chat on WhatsApp"
      >
        W
      </a>
    </div>
  );
}
