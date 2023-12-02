import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import style from "../styles/Home.module.css";

export default function MyMap(props: any) {
  const { position } = props;
  console.log(position);
  // how??????
  // const mapTilerUrl = process.env.MAPTILER_URL ?? "";
  // const mapTilerAttributes = process.env.MAPTILER_ATTRIBUTION ?? "";

  // console.log(mapTilerUrl, mapTilerAttributes);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className={style.leaflet}
    >
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=CIEq0nQN9kXZpHrRLesM"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export { MyMap };
