import { useEffect, useState } from "react";

function useMarker() {
  const [markers, setMarkers] = useState<{ uuid: string; label: string }[]>([]);

  useEffect(() => {
    setMarkers([...markers, { uuid: "test_01", label: "test label" }]);
  }, []);

  return [markers] as const;
}

export default useMarker;
