import { cn } from '@/lib/utils'

/**
 * Shows Pauper legality status for a card.
 * @param {{ legality: 'legal'|'banned'|'not_legal'|'restricted', className?: string }} props
 */
export function LegalityBadge({ legality, className }) {
  const config = {
    legal: { label: 'Legal', classes: 'bg-green-500/15 text-green-600 dark:text-green-400' },
    banned: { label: 'Banned', classes: 'bg-red-500/15 text-red-600 dark:text-red-400' },
    not_legal: {
      label: 'Not Legal',
      classes: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
    },
    restricted: {
      label: 'Restricted',
      classes: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    },
  }

  const { label, classes } = config[legality] ?? config.not_legal

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        classes,
        className,
      )}
    >
      {label}
    </span>
  )
}
