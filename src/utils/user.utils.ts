import type { Social } from '@/types/user.types';

import {
  IconFacebook1,
  IconFigma1,
  IconGithub1,
  IconGlobe,
  IconInstagram1,
  IconLinkedIn1,
  IconPinterest1,
  IconSpotify1,
  IconTelegram1,
  IconX1,
  IconYoutube1,
} from '@/components/svgs/icons';

export const SOCIAL_CONFIG = {
  facebook: {
    label: 'Facebook',
    icon: IconFacebook1,
  },
  figma: {
    label: 'Figma',
    icon: IconFigma1,
  },
  github: {
    label: 'GitHub',
    icon: IconGithub1,
  },
  instagram: {
    label: 'Instagram',
    icon: IconInstagram1,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: IconLinkedIn1,
  },
  pinterest: {
    label: 'Pinterest',
    icon: IconPinterest1,
  },
  spotify: {
    label: 'Spotify',
    icon: IconSpotify1,
  },
  telegram: {
    label: 'Telegram',
    icon: IconTelegram1,
  },
  twitter: {
    label: 'X',
    icon: IconX1,
  },
  website: {
    label: 'Website',
    icon: IconGlobe,
  },
  youtube: {
    label: 'YouTube',
    icon: IconYoutube1,
  },
} satisfies Record<Social, { label: string; icon: React.ComponentType }>;

export const getFullName = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const first = firstName?.trim() ?? '';
  const last = lastName?.trim() ?? '';

  if (!first && !last) {
    return '';
  }

  return `${first} ${last}`.trim();
};

export const userInitials = (fullName: string) => {
  return fullName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};
