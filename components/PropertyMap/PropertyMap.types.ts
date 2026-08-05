export type PropertyMapCoordinates = {
  lat: number;
  lng: number;
};

export type PropertyMapProps = {
  center: PropertyMapCoordinates;
  zoom?: number;
  height?: number;
};
