import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from '../colors'
import { spacing } from '../spacing'
import { radius } from '../radius'
import { typography } from '../typography'
import { shadows } from '../shadows'

export function createNaiveThemeOverrides(): GlobalThemeOverrides {
  return {
    common: {
      primaryColor: colors.primary,
      primaryColorHover: colors.primaryHover,
      primaryColorPressed: colors.primaryPressed,
      infoColor: colors.info,
      successColor: colors.success,
      warningColor: colors.warning,
      errorColor: colors.error,
      borderRadius: radius.md,
      borderRadiusSmall: radius.sm,
      fontSize: typography.fontSize.sm,
      fontSizeMini: typography.fontSize.xs,
      fontSizeTiny: typography.fontSize.xs,
      fontSizeSmall: typography.fontSize.sm,
      fontSizeMedium: typography.fontSize.sm,
      fontSizeLarge: typography.fontSize.md,
      fontSizeHuge: typography.fontSize.lg,
    },
    Button: {
      borderRadiusMedium: radius.md,
    },
    Card: {
      borderRadius: radius.lg,
    },
    Input: {
      borderRadius: radius.md,
    },
  }
}
