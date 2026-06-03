'use client';

import { useEffect } from 'react';

type DataLayerEvent = Record<string, unknown>;

const ensureDataLayer = (): DataLayerEvent[] => {
  const scopedWindow = window as Window & { dataLayer?: DataLayerEvent[] };
  if (!Array.isArray(scopedWindow.dataLayer)) {
    scopedWindow.dataLayer = [];
  }
  return scopedWindow.dataLayer;
};

const normalizePhone = (href: string) => href.replace(/^tel:/i, '').replace(/[^\d+]/g, '');

const isWhatsAppUrl = (href: string) => {
  const lowerHref = href.toLowerCase();
  return lowerHref.includes('wa.me/') || lowerHref.includes('whatsapp.com/') || lowerHref.includes('api.whatsapp.com/');
};

export default function AnalyticsClickTracking() {
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement | null;
      const anchor = targetElement?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) {
        return;
      }

      const rawHref = anchor.getAttribute('href') || '';
      if (!rawHref) {
        return;
      }

      const dataLayer = ensureDataLayer();
      const basePayload: DataLayerEvent = {
        link_text: (anchor.textContent || '').trim(),
        page_path: window.location.pathname,
      };

      if (rawHref.toLowerCase().startsWith('tel:')) {
        dataLayer.push({
          event: 'phone_click',
          phone_number: normalizePhone(rawHref),
          link_url: rawHref,
          ...basePayload,
        });
        return;
      }

      if (isWhatsAppUrl(rawHref)) {
        dataLayer.push({
          event: 'whatsapp_click',
          whatsapp_url: rawHref,
          ...basePayload,
        });
      }
    };

    const onDocumentSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement | null;
      if (!target || target.tagName.toLowerCase() !== 'form') {
        return;
      }

      const dataLayer = ensureDataLayer();
      dataLayer.push({
        event: 'form_submit',
        form_id: target.id || '',
        form_name: target.getAttribute('name') || '',
        form_action: target.getAttribute('action') || '',
        page_path: window.location.pathname,
      });
    };

    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('submit', onDocumentSubmit, true);
    return () => {
      document.removeEventListener('click', onDocumentClick, true);
      document.removeEventListener('submit', onDocumentSubmit, true);
    };
  }, []);

  return null;
}