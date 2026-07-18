import { useEffect } from "react";

type HelmetProps = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
};

export function Helmet({
  title,
  description,
  image,
  url,
}: HelmetProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      value: string
    ) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, selector.match(/["'](.+)["']/)?.[1] || "");
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", value);
    };

    const setLink = (rel: string, href: string) => {
      let link = document.querySelector(
        `link[rel="${rel}"]`
      ) as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }

      link.href = href;
    };

    if (description) {
      setMeta('meta[name="description"]', "name", description);
      setMeta('meta[property="og:description"]', "property", description);
      setMeta('meta[name="twitter:description"]', "name", description);
    }

    setMeta('meta[property="og:title"]', "property", title);
    setMeta('meta[name="twitter:title"]', "name", title);

    if (image) {
      setMeta("meta[property=\"og:image\"]", "property", image);
      setMeta("meta[name=\"twitter:image\"]", "name", image);
    }

    if (url) {
      setMeta("meta[property=\"og:url\"]", "property", url);
      setLink("canonical", url);
    }
  }, [title, description, image, url]);

  return null;
}