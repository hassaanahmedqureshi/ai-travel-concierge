"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Location = { name: string; lat: number; lng: number };

function FitBounds({ locations }: { locations: Location[] }) {
    const map = useMap();
    useEffect(() => {
        if (locations.length === 0) return;
        const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
        map.fitBounds(bounds, { padding: [40, 40] });
    }, [locations, map]);
    return null;
}

export default function MapView({ locations }: { locations: Location[] }) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <MapContainer
                center={[locations[0]?.lat ?? 0, locations[0]?.lng ?? 0]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <FitBounds locations={locations} />
                {locations.map((loc, i) => (
                    <Marker key={i} position={[loc.lat, loc.lng]}>
                        <Popup>{loc.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}