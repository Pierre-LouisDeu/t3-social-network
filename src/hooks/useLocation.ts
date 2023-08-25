import { useEffect, useState } from "react";
import { type Address } from "~/server/api/routers/tweet";

type UseLocationType = {
  address: Address | null;
};

export const useLocation = (): UseLocationType => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(setPosition);
  }, []);

  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position?.coords?.latitude}&lon=${position?.coords?.longitude}`;

  useEffect(() => {
    if (!position) return;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const address: Address = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          country: data.address.country,
          town: data.address.town,
          road: data.address.road,
        };
        setAddress(address);
      })
      .catch((error) => {
        console.warn("Error retrieving openstreetmap data: ", error);
      });
  }, [apiUrl, position]);

  return { address };
};
