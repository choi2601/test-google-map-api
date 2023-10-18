import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import useMarker from "./useMarker";
import factory from "./customMarker";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

function Entry() {
  const [zoom, setZoom] = useState(3);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const [markers] = useMarker();

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
        render={render}
      >
        <Map center={center} onIdle={onIdle} zoom={zoom}>
          {markers.map((marker, i) => (
            <Marker key={i} marker={marker} />
          ))}
        </Map>
      </Wrapper>
    </div>
  );
}

interface MapProps extends google.maps.MapOptions {
  onIdle?: (map: google.maps.Map) => void;
  children: React.ReactNode;
}

function Map({ onIdle, children, ...options }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          ...options,
        })
      );
    }
  }, [ref, map, options]);

  useEffect(() => {
    if (map) {
      ["idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onIdle]);

  return (
    <>
      <div ref={ref} style={{ flexGrow: "1", height: "100%" }} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<MarkerProps>, {
            map,
          });
        }
      })}
    </>
  );
}

interface MarkerProps {
  marker: { uuid: string; label: string };
  map?: google.maps.Map;
}

function Marker({ marker, map }: MarkerProps) {
  useEffect(() => {
    if (!marker || !map) {
      return;
    }

    const { uuid, label } = marker;

    const customMarker = factory()({ uuid, label });

    customMarker.position = map.getCenter();
    customMarker.setMap(map);
  }, [map, marker]);

  return null;
}

export default Entry;
