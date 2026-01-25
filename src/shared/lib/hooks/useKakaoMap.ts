import { useEffect, useCallback, RefObject } from 'react';

interface UseKakaoMapProps {
  mapRef: RefObject<HTMLDivElement | null>;
  appKey: string;
  center: { lat: number; lng: number };
  level?: number;
  onMarkerClick?: () => void;
}

export const useKakaoMap = ({
  mapRef,
  appKey,
  center,
  level = 3,
  onMarkerClick,
}: UseKakaoMapProps) => {
  const initMap = useCallback(() => {
    if (!window.kakao) return;

    const container = mapRef.current;
    if (!container) return;

    window.kakao.maps.load(() => {
      const target = new window.kakao.maps.LatLng(center.lat, center.lng);
      const options = {
        center: target,
        level: level,
      };

      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: target,
        map: map,
      });

      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', onMarkerClick);
      }
    });
  }, [mapRef, center, level, onMarkerClick]);

  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src*="dapi.kakao.com/v2/maps/sdk.js"]`
    );

    if (existingScript) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;

    document.head.appendChild(script);
    script.onload = initMap;

    return () => {
      if (!existingScript) {
        document.head.removeChild(script);
      }
    };
  }, [appKey, initMap]);
};
