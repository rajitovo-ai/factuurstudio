/** Aantal succesvolle registraties dat nodig is voor 1 gratis Pro-maand */
export const REFERRAL_REWARD_THRESHOLD = 3

/**
 * Genereert een unieke referral-code in het formaat FS-XXXXXX.
 * Gebruikt alleen eenduidige tekens (geen 0/O, 1/I/L).
 */
export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = 'FS-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
