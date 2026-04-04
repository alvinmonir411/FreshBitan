import { buildWhatsappLink } from "@/lib/utils";
import { SiteContent } from "@/types/site";

interface FloatingContactButtonsProps {
  siteContent: SiteContent;
}

export function FloatingContactButtons({
  siteContent,
}: FloatingContactButtonsProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={siteContent.facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1877f2] text-lg font-black text-white shadow-[0_18px_40px_rgba(24,119,242,0.26)]"
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
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-xl font-black text-white shadow-[0_18px_40px_rgba(37,211,102,0.3)]"
        aria-label="Chat on WhatsApp"
      >
        W
      </a>
    </div>
  );
}
