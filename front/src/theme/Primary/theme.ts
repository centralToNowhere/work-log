import { colors } from './colors';

const primaryTheme = {
  token: {
    colorPrimary: colors.primary,
    colorError: colors.status.danger,
    colorTextBase: colors.text.primary,
    colorBgBase: colors.background.default,
    colorBorder: colors.border.muted,
    fontSize: 14,
    fontSizeHeading1: 28,
    fontSizeHeading2: 24,
    fontSizeHeading3: 22,
    paddingXXS: 14,
    colorPrimaryBorder: colors.button.accentBorder,
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Button: {
      primaryColor: colors.text.secondary,
      defaultColor: colors.text.primary,
      fontFamily: 'Inter, sans-serif',
      primaryShadow:
        '0px 8px 8px rgba(54, 122, 255, 0.03), inset 0px -2px 0px 1px rgba(0, 0, 0, 0.08)',
      paddingInline: 14,
      paddingBlock: 10,
      paddingBlockLg: 16,
      paddingBlockSm: 1.5,
      onlyIconSizeSM: 24,
      onlyIconSizeMD: 22,
      controlHeight: 42,
      controlHeightSM: 27,
      controlHeightLG: 54,
    },
    Input: {
      paddingInline: 16,
      paddingBlock: 14,
      fontSize: 18,
      fontFamily: 'Inter, sans-serif',
      controlHeight: 48,
      controlHeightSM: 28,
      controlHeightLG: 54,
      colorBgContainer: colors.gray.lighter,
      activeBg: colors.background.default,
    },
    Table: {
      colorText: colors.text.primary,
      fontSize: 16,
      cellPaddingBlock: 8,
      colorBgContainer: colors.background.gray,
      borderColor: colors.border.divider,
      headerBg: colors.background.gray,
      rowHoverBg: colors.background.light,
      headerColor: colors.text.primary,
      rowSelectedBg: colors.background.default,
      rowSelectedHoverBg: colors.background.default,
    },
    Form: {
      itemMarginBottom: 16,
    },
    Card: {
      bodyPadding: 30,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      borderRadius: 10,
    },
    Progress: {
      lineBorderRadius: 0,
      motionDurationSlow: '0.05s',
      remainingColor: colors.background.light,
    },
    Checkbox: {
      colorPrimary: colors.background.primary,
      colorPrimaryHover: colors.background.primary,
      borderRadiusSM: 4,
    },
    Layout: {
      headerBg: colors.background.default,
    },
  },
};

export default primaryTheme;
