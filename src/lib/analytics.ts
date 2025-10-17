// This is a type declaration for the global window object to include gtag.
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: any
    ) => void;
  }
}

type EventParams = {
  [key: string]: string | number | undefined;
};

export const track = (eventName: string, params?: EventParams) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    console.log(`Analytics event: ${eventName}`, params);
  }
};
