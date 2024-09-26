export const SOCIAL_CARD_STYLES = {
  youtube: { bgColor: 'bg-red-600', title: 'YouTube', hexColor: '#DC2626' },
  twitch: { bgColor: 'bg-purple-600', title: 'Twitch', hexColor: '#9333EA' },
  github: { bgColor: 'bg-gray-800', title: 'GitHub', hexColor: '#1F2937' },
  tiktok: { bgColor: 'bg-black', title: 'TikTok', hexColor: '#000000' },
  instagram: {
    bgColor: 'bg-pink-600',
    title: 'Instagram',
    hexColor: '#DB2777'
  },
  twitter: { bgColor: 'bg-blue-400', title: 'Twitter', hexColor: '#60A5FA' },
  x: { bgColor: 'bg-zinc-900', title: 'X', hexColor: '#18181B' },
  linkedin: { bgColor: 'bg-blue-700', title: 'LinkedIn', hexColor: '#1D4ED8' },
  facebook: { bgColor: 'bg-blue-600', title: 'Facebook', hexColor: '#2563EB' },
  pinterest: { bgColor: 'bg-red-700', title: 'Pinterest', hexColor: '#B91C1C' },
  snapchat: {
    bgColor: 'bg-yellow-400',
    title: 'Snapchat',
    hexColor: '#FBBF24'
  },
  reddit: { bgColor: 'bg-orange-600', title: 'Reddit', hexColor: '#EA580C' },
  tumblr: { bgColor: 'bg-blue-800', title: 'Tumblr', hexColor: '#1E40AF' },
  whatsapp: { bgColor: 'bg-green-500', title: 'WhatsApp', hexColor: '#22C55E' },
  telegram: { bgColor: 'bg-blue-500', title: 'Telegram', hexColor: '#3B82F6' },
  medium: { bgColor: 'bg-black', title: 'Medium', hexColor: '#000000' },
  spotify: { bgColor: 'bg-green-600', title: 'Spotify', hexColor: '#16A34A' },
  soundcloud: {
    bgColor: 'bg-orange-500',
    title: 'SoundCloud',
    hexColor: '#F97316'
  },
  behance: { bgColor: 'bg-blue-600', title: 'Behance', hexColor: '#2563EB' },
  dribbble: { bgColor: 'bg-pink-500', title: 'Dribbble', hexColor: '#EC4899' },
  vimeo: { bgColor: 'bg-blue-700', title: 'Vimeo', hexColor: '#1D4ED8' },
  flickr: { bgColor: 'bg-pink-400', title: 'Flickr', hexColor: '#F472B6' },
  deviantart: {
    bgColor: 'bg-green-800',
    title: 'DeviantArt',
    hexColor: '#166534'
  },
  etsy: { bgColor: 'bg-orange-600', title: 'Etsy', hexColor: '#EA580C' },
  patreon: { bgColor: 'bg-red-500', title: 'Patreon', hexColor: '#EF4444' },
  discord: { bgColor: 'bg-indigo-600', title: 'Discord', hexColor: '#4F46E5' }
}

export function handleCardSelect(draggedElement: HTMLElement) {
  const selectedCard = draggedElement.querySelector('.colored')
  const backgroundColor = selectedCard
    ? window.getComputedStyle(selectedCard).backgroundColor
    : 'rgba(0, 0, 0, 0.138)'

  const rgbaColor = backgroundColor.replace(
    /rgba?\((\d+), (\d+), (\d+)(?:, (\d+\.?\d*))?\)/,
    (match, r, g, b) => `rgba(${r}, ${g}, ${b}, 0.138)`
  )

  document.documentElement.style.setProperty(
    '--selected-card-background',
    rgbaColor
  )
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
}
