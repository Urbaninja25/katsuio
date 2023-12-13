import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import style from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import L from "leaflet";

export default function MyMap(props: any) {
  const { position } = props;

  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    async function fetchStreetName() {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*", // Use "*" with caution in production
            },
          },
        );
        const data = await response.json();

        if (data && data.address) {
          setAddress(data.display_name); // Update state with the street name
        }
      } catch (error) {
        console.error("Error fetching street name:", error);
      }
    }

    fetchStreetName(); // Call the function inside useEffect

    // Fetch user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
      );
    } else {
      console.error(
        "Geolocation is not supported in this browser.please give katsuio access to ur geolocation data ",
      );
    }
  }, [position]);

  const customIconForUserMarker = L.icon({
    iconUrl:
      "https://cdn0.iconfinder.com/data/icons/map-navigation-volume-1/500/current_location-1024.png", // Specify the URL to your custom icon
    iconSize: [50, 50], // Set the size of the icon
    iconAnchor: [16, 32], // Set the anchor point of the icon
    popupAnchor: [9, -32], // Set the popup anchor point relative to the icon
  });

  const customIconForActivityMarker = L.icon({
    iconUrl:
      "https://cdn4.iconfinder.com/data/icons/map-navigation-navy-vol-1/512/Current_Location-512.png",
    iconSize: [50, 50], // Set the size of the icon
    iconAnchor: [16, 32], // Set the anchor point of the icon
    popupAnchor: [9, -32], // Set the popup anchor point relative to the icon
  });

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={true}
      className={style.leaflet}
    >
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=CIEq0nQN9kXZpHrRLesM"
      />
      <Marker position={position} icon={customIconForActivityMarker}>
        {address ? (
          <Popup autoPan={false} closeButton={false}>
            {address}
          </Popup>
        ) : (
          <Popup autoPan={false} closeButton={false}>
            Activity Location
          </Popup>
        )}
      </Marker>
      {userLocation && (
        <Marker position={userLocation} icon={customIconForUserMarker}>
          <Popup closeButton={false} autoPan={true}>
            your Current Location 👀{" "}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export { MyMap };
