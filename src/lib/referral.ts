/** Aantal succesvolle registraties dat nodig is voor 1 gratis Pro-maand */
export const REFERRAL_REWARD_THRESHOLD = 3

export type ReferralRewardType = 'pro_month' | 'discount_percent' | 'credit_eur'

export type ReferralRewardConfig = {
  threshold: number
  rewardType: ReferralRewardType
  rewardValue: number
}

export const DEFAULT_REFERRAL_REWARD_CONFIG: ReferralRewardConfig = {
  threshold: REFERRAL_REWARD_THRESHOLD,
  rewardType: 'pro_month',
  rewardValue: 1,
}

export const getReferralRewardLabel = (config: ReferralRewardConfig): string => {
  if (config.rewardType === 'pro_month') {
    const months = Math.max(1, Math.round(config.rewardValue))
    return `${months} maand${months === 1 ? '' : 'en'} Pro gratis`
  }

  if (config.rewardType === 'discount_percent') {
    return `${config.rewardValue}% korting`
  }

  return `EUR ${config.rewardValue.toFixed(2)} tegoed`
}

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
