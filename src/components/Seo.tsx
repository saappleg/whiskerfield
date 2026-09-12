import { useEffect, useState } from 'react';
import { getArticleId } from '../lib/router';
import { SITE_DESCRIPTION, SITE_IMAGE, SITE_NAME, SITE_URL, getSeoDetails } from '../lib/seo';

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.svg`,
  description: SITE_DESCRIPTION,
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
}

function getLocationKey() {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getRouteFromLocation() {
  if (typeof window === 'undefined') return { route: 'home', articleId: '' };
  const source = window.location.hash || window.location.pathname;
  const clean = source.replace(/^#\/?/, '').replace(/^\/+/, '').toLowerCase();
  const path = clean.split(/[?#]/, 1)[0];
  const route = path === 'stories' || path === 'journal' || path === 'articles' || path === 'guides' || path.startsWith('stories/article/') || path.startsWith('stories/member/')
    ? 'stories'
    : path === 'care' || path === 'health' || path === 'wellness'
      ? 'care'
      : path === 'products' || path === 'reviews' || path === 'product-lab' || path === 'shop'
        ? 'products'
        : path === 'news' || path === 'dispatch' || path === 'cat-news'
          ? 'news'
          : path === 'members' || path === 'community' || path === 'cat-club' || path === 'club' || path === 'shelf'
            ? 'members'
            : path === 'privacy' || path === 'terms'
              ? 'privacy'
              : 'home';
  return {
    route,
    articleId: getArticleId(source, window.location.search),
  };
}

export function Seo() {
  const [locationKey, setLocationKey] = useState(getLocationKey);

  useEffect(() => {
    const update = () => setLocationKey(getLocationKey());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  useEffect(() => {
    // Keep this effect tied to the location key so deep article hashes update
    // share cards even when the top-level route remains “stories”.
    void locationKey;
    const { route, articleId } = getRouteFromLocation();
    const details = getSeoDetails(route, articleId);
    const image = SITE_IMAGE;

    document.title = details.title;
    setMeta('name', 'description', details.description);
    setMeta('property', 'og:title', details.title);
    setMeta('property', 'og:description', details.description);
    setMeta('property', 'og:type', details.type);
    setMeta('property', 'og:url', details.canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', details.imageAlt);
    setMeta('name', 'twitter:title', details.title);
    setMeta('name', 'twitter:description', details.description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', details.imageAlt);
    setCanonical(details.canonical);

    const graph: Record<string, unknown>[] = [
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, description: SITE_DESCRIPTION, publisher: { '@id': `${SITE_URL}/#organization` } },
      ORGANIZATION,
    ];
    if (details.article) {
      graph.push({
        '@type': 'Article',
        '@id': `${details.canonical}#article`,
        headline: details.article.title,
        description: details.article.dek,
        url: details.canonical,
        image,
        articleSection: details.article.category,
        author: { '@type': 'Organization', name: 'Whiskerfield Editorial Desk' },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isAccessibleForFree: true,
      });
    }
    let script = document.head.querySelector<HTMLScriptElement>('#whiskerfield-seo-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'whiskerfield-seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [locationKey]);

  return null;
}
