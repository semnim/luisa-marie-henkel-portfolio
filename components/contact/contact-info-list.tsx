'use client';

import { PopoverArrow, PopoverContent } from '@radix-ui/react-popover';
import {
  Check,
  CopyIcon,
  Instagram,
  LucideIcon,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { ComponentProps, useCallback, useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger } from '../ui/popover';

const SOCIAL_ITEMS = ['tel', 'mail', 'instagram'] as const;
type SocialItem = (typeof SOCIAL_ITEMS)[number];

const ICONS = {
  tel: Phone,
  mail: Mail,
  instagram: Instagram,
};
const SOCIALS = {
  tel: { content: '+49 15126113117', uri: 'tel:+4915126113117' },
  mail: {
    content: 'luisamariehenkel@gmail.com',
    uri: 'mailto:luisamariehenkel@gmail.com',
  },
  instagram: {
    content: '@oh_luisa',
    uri: 'https://www.instagram.com/oh_luisa/',
  },
};

export const ContactInfoList = () => {
  const [isCopied, setIsCopied] = useState<Record<SocialItem, boolean>>({
    mail: false,
    tel: false,
    instagram: false,
  });

  const handleIsCopied = (item: SocialItem, isCopied: boolean) => {
    setIsCopied((prev) => ({ ...prev, [item]: isCopied }));
  };
  const handleCopy = useCallback(
    (item: SocialItem) => {
      if (isCopied[item]) return;

      const content = SOCIALS[item].content;
      navigator.clipboard
        .writeText(content)
        .then(() => {
          handleIsCopied(item, true);
          setTimeout(() => handleIsCopied(item, false), 3000);
        })
        .catch((error) => {
          console.error('Error copying command', error);
        });
    },
    [isCopied]
  );

  return (
    <>
      <div className="text-lg tracking-item-subheading flex items-start pt-4 gap-4 font-light">
        {SOCIAL_ITEMS.map((item) => {
          const Icon = ICONS[item];
          return (
            <Popover key={item}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant={'ghost'}
                  className="cursor-pointer"
                >
                  <Icon size={25} className="text-foreground cursor-pointer" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                className="flex bg-white/20 rounded-sm pl-4 gap-1 pr-2 py-2 items-center tracking-widest"
              >
                <PopoverArrow className=" fill-white/20" />
                <SocialsPopoverInfo
                  item={item}
                  isCopied={isCopied[item]}
                  handleCopy={handleCopy}
                />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </>
  );
};

function CopySocialIcon({
  isCopied,
  ...props
}: { isCopied: boolean } & ComponentProps<LucideIcon>) {
  if (isCopied) {
    return <Check {...props} />;
  }

  return <CopyIcon {...props} />;
}

function SocialsPopoverInfo({
  item,
  isCopied,
  handleCopy,
}: {
  item: SocialItem;
  isCopied: boolean;
  handleCopy: (item: SocialItem) => void;
}) {
  return (
    <>
      <Link
        href={SOCIALS[item].uri}
        className="underline text-sm"
        target="_blank"
      >
        {SOCIALS[item].content}
      </Link>
      <Button variant={'ghost'} onClick={() => handleCopy(item)}>
        <CopySocialIcon isCopied={isCopied} className="w-3! h-3!" />
      </Button>
    </>
  );
}
