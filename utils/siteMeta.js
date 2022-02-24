const type = "website";
const url = "https://mysite.com";
const title = "Zero Code NFT dApp";
const description = "Another NFT drop powered by Zero Code NFT";
const mainImage = "https://zerocodenft-dapp.netlify.app/zerocodenftlogo_dark.svg";
const twitterCard = "summary_large_image";

export default (meta) => {

    // console.log({meta})
    return [
      {
        hid: "image",
        property: "image",
        content: (meta && meta.mainImage) || mainImage,
      },
      {
        hid: "title",
        property: "title",
        content: (meta && meta.title) || title,
      },
      {
        hid: "description",
        name: "description",
        content: (meta && meta.description) || description,
      },
      {
        hid: "og:type",
        property: "og:type",
        content: (meta && meta.type) || type,
      },
      {
        hid: "og:url",
        property: "og:url",
        content: (meta && meta.url) || url,
      },
      {
        hid: "og:title",
        property: "og:title",
        content: (meta && meta.title) || title,
      },
      {
        hid: "og:description",
        property: "og:description",
        content: (meta && meta.description) || description,
      },
      {
        hid: "og:image",
        property: "og:image",
        content: (meta && meta.mainImage) || mainImage,
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: (meta && meta.twitterCard) || twitterCard,
      },
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: (meta && meta.url) || url,
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: (meta && meta.title) || title,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: (meta && meta.description) || description,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: (meta && meta.mainImage) || mainImage,
      },
    ];
  };