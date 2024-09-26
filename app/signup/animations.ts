export const pageVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 20 : -20
  }),
  in: {
    opacity: 1,
    x: 0
  },
  out: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? 20 : -20
  })
}

export const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
}
