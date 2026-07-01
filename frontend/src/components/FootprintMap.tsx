import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 高德浅色瓦片(style=8)，中文标注
const GAODE_URL = 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';

// 组件只依赖坐标与 id，用最小结构约束，兼容各处的 Footprint 类型
type MapFootprint = { id: string; lat: number | null; lng: number | null };

// 金色涟漪标记(复刻站点现有样式)，selected 态高亮放大
function goldRippleIcon(selected: boolean): L.DivIcon {
  return L.divIcon({
    className: 'footprint-divicon',
    html: `<span style="position:relative;display:flex;align-items:center;justify-content:center;width:20px;height:20px">
      <span class="${selected ? 'animate-ping' : ''}" style="position:absolute;display:inline-flex;width:20px;height:20px;border-radius:9999px;background:rgba(197,168,128,0.4)"></span>
      <span style="position:relative;display:inline-flex;border-radius:9999px;width:${selected ? 14 : 10}px;height:${selected ? 14 : 10}px;background:${selected ? '#ffffff' : '#C5A880'};box-shadow:0 0 8px #C5A880"></span>
    </span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// 选中项变化时飞行巡览到该坐标
function FlyToSelected({ target }: { target: MapFootprint | null }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.lat != null && target.lng != null) {
      map.flyTo([target.lat, target.lng], 6, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

interface FootprintMapProps<T extends MapFootprint> {
  footprints: T[];
  selected: T | null;
  onSelect: (fp: T) => void;
}

export function FootprintMap<T extends MapFootprint>({ footprints, selected, onSelect }: FootprintMapProps<T>) {
  const withCoords = footprints.filter((f) => f.lat != null && f.lng != null);
  return (
    <MapContainer
      center={[30, 105]}
      zoom={3}
      scrollWheelZoom
      className="w-full h-full"
      style={{ background: '#fffdf6' }}
    >
      <TileLayer url={GAODE_URL} subdomains={['1', '2', '3', '4']} attribution='&copy; 高德地图' />
      <FlyToSelected target={selected} />
      {withCoords.map((fp) => (
        <Marker
          key={fp.id}
          position={[fp.lat as number, fp.lng as number]}
          icon={goldRippleIcon(selected?.id === fp.id)}
          eventHandlers={{ click: () => onSelect(fp) }}
        />
      ))}
    </MapContainer>
  );
}
