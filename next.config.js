const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  i18n: {
    locales: [
      "be",
      "bg",
      "bn",
      "bo",
      "bs",
      "ca",
      "cs",
      "da",
      "de",
      "el",
      "en",
      "es",
      "et",
      "fi",
      "fil",
      "fr",
      "ga",
      "hi",
      "hr",
      "hu",
      "hy",
      "id",
      "is",
      "it",
      "ja",
      "jv",
      "ka",
      "kk",
      "km",
      "ko",
      "ks",
      "ky",
      "lb",
      "lt",
      "lv",
      "mk",
      "ml",
      "mn",
      "ms",
      "mt",
      "my",
      "ne",
      "nl",
      "no",
      "pa",
      "pl",
      "pt",
      "ro",
      "ru",
      "sc",
      "sk",
      "sl",
      "sq",
      "sr",
      "sv",
      "ta",
      "th",
      "tk",
      "tr",
      "uk",
      "uz",
      "vi",
      "zh-Hans"
    ],
    defaultLocale: 'es',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.experiments.topLevelAwait = true 
    return config;
  }
});
