export enum ExternalURL {
  twitter,
  notion,
  discourse,
  instagram,
  nounsCenter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.twitter:
      return 'https://twitter.com/unouns_dao';
    case ExternalURL.notion:
      return 'https://separate-sundial-e59.notion.site/Explorer-UNouns-4f6263dd577647aaaf2982689f9aca80';
    case ExternalURL.discourse:
      return 'https://discourse.unouns.wtf/';
    case ExternalURL.instagram:
      return 'https://www.instagram.com/unouns_dao/';
    case ExternalURL.nounsCenter:
      return 'https://nouns.center/';
  }
};
