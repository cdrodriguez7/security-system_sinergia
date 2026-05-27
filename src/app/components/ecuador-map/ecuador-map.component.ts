import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';

interface MapMarkerData {
  name: string;
  lat: number;
  lng: number;
  operations: number;
  percentage: number;
  responseTime: string;
  color: string;
  colorRgba: string;
}

@Component({
  selector: 'app-ecuador-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  template: `
    <div class="map-wrapper" [style.height]="mapHeight">
      <div class="map-container-leaflet"
           leaflet
           [leafletOptions]="options"
           (leafletMapReady)="onMapReady($event)"
           [style.height]="mapHeight">
      </div>
      <div class="map-legend" *ngIf="!compact">
        <h4>Leyenda</h4>
        <div class="legend-item" *ngFor="let marker of markers">
          <span class="legend-dot" [style.background]="marker.color"></span>
          <span class="legend-name">{{ marker.name }}</span>
          <span class="legend-ops">{{ marker.operations | number }} ops</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-wrapper {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    .map-container-leaflet {
      width: 100%;
      z-index: 1;
    }

    .map-legend {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 12px;
      padding: 16px 20px;
      z-index: 1000;
      color: #0f172a;
      min-width: 200px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);

      h4 {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: rgba(15, 23, 42, 0.6);
        margin-bottom: 12px;
        font-weight: 600;
      }
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      font-size: 13px;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(15, 23, 42, 0.06);
      }
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-name {
      flex: 1;
      font-weight: 500;
    }

    .legend-ops {
      color: rgba(15, 23, 42, 0.5);
      font-size: 12px;
    }

    :host ::ng-deep {
      .leaflet-container {
        background: #f8fafc;
        font-family: 'Inter', 'Segoe UI', sans-serif;
      }

      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;

        a {
          background: rgba(255, 255, 255, 0.9) !important;
          color: #0f172a !important;
          border: 1px solid rgba(15, 23, 42, 0.08) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);

          &:hover {
            background: #ffffff !important;
            color: #2563eb !important;
          }
        }

        .leaflet-control-zoom-in {
          border-radius: 8px 8px 0 0 !important;
        }

        .leaflet-control-zoom-out {
          border-radius: 0 0 8px 8px !important;
        }
      }

      .leaflet-control-attribution {
        background: rgba(255, 255, 255, 0.8) !important;
        color: rgba(15, 23, 42, 0.5) !important;
        font-size: 10px !important;
        backdrop-filter: blur(8px);

        a {
          color: rgba(37, 99, 235, 0.8) !important;
        }
      }

      /* Custom popup styles */
      .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 14px;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
        color: #0f172a;
        padding: 0;
      }

      .custom-popup .leaflet-popup-content {
        margin: 0;
        min-width: 220px;
      }

      .custom-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-top: none;
        border-left: none;
      }

      .custom-popup .leaflet-popup-close-button {
        color: rgba(15, 23, 42, 0.5) !important;
        font-size: 20px !important;
        top: 8px !important;
        right: 10px !important;

        &:hover {
          color: #0f172a !important;
        }
      }
    }

    /* Pulse animation for custom markers */
    :host ::ng-deep .marker-pin {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host ::ng-deep .marker-pin-inner {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25);
      position: relative;
      z-index: 2;
    }

    :host ::ng-deep .marker-pin-pulse {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      opacity: 0.35;
      z-index: 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: mapPulse 2.5s ease-out infinite;
    }

    @keyframes mapPulse {
      0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0.5;
      }
      100% {
        transform: translate(-50%, -50%) scale(2.2);
        opacity: 0;
      }
    }
  `]
})
export class EcuadorMapComponent implements OnInit, AfterViewInit {
  @Input() mapHeight: string = '500px';
  @Input() compact: boolean = false;

  private map!: L.Map;

  markers: MapMarkerData[] = [
    {
      name: 'Guayaquil',
      lat: -2.1894,
      lng: -79.8891,
      operations: 4500,
      percentage: 35,
      responseTime: '< 1 hora',
      color: '#f59e0b',
      colorRgba: 'rgba(245, 158, 11, 0.25)'
    },
    {
      name: 'Quito',
      lat: -0.1807,
      lng: -78.4678,
      operations: 2800,
      percentage: 22,
      responseTime: '< 1 hora',
      color: '#3b82f6',
      colorRgba: 'rgba(59, 130, 246, 0.25)'
    },
    {
      name: 'Cuenca',
      lat: -2.9001,
      lng: -79.0059,
      operations: 1200,
      percentage: 9,
      responseTime: '< 2 horas',
      color: '#8b5cf6',
      colorRgba: 'rgba(139, 92, 246, 0.25)'
    },
    {
      name: 'Zamora',
      lat: -4.0689,
      lng: -78.9504,
      operations: 3200,
      percentage: 25,
      responseTime: '< 4 horas',
      color: '#10b981',
      colorRgba: 'rgba(16, 185, 129, 0.25)'
    }
  ];

  options: L.MapOptions = {
    zoom: 7,
    center: L.latLng(-1.8312, -78.8834),
    zoomControl: true,
    attributionControl: true,
    maxBounds: L.latLngBounds(
      L.latLng(-6.0, -82.5),
      L.latLng(2.5, -74.5)
    ),
    maxBoundsViscosity: 0.8,
    minZoom: 6,
    maxZoom: 13
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onMapReady(map: L.Map): void {
    this.map = map;

    // Light tile layer - CartoDB Positron
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Add markers and coverage circles
    this.markers.forEach(markerData => {
      this.addCustomMarker(map, markerData);
      this.addCoverageCircle(map, markerData);
    });

    // Fix tile rendering after initialization
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }

  private addCustomMarker(map: L.Map, data: MapMarkerData): void {
    const iconHtml = `
      <div class="marker-pin">
        <div class="marker-pin-pulse" style="background: ${data.color};"></div>
        <div class="marker-pin-inner" style="background: ${data.color};"></div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });

    const popupContent = `
      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${data.color};"></div>
          <h3 style="margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -0.3px; color: #0f172a;">${data.name}</h3>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div style="background: rgba(15, 23, 42, 0.04); border-radius: 10px; padding: 12px; text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: ${data.color};">${data.operations.toLocaleString()}</div>
            <div style="font-size: 11px; color: rgba(15, 23, 42, 0.5); margin-top: 2px; font-weight: 500;">Operaciones</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.04); border-radius: 10px; padding: 12px; text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: ${data.color};">${data.percentage}%</div>
            <div style="font-size: 11px; color: rgba(15, 23, 42, 0.5); margin-top: 2px; font-weight: 500;">Del Total</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(15, 23, 42, 0.03); border-radius: 8px;">
          <span style="font-size: 16px;">⏱️</span>
          <span style="font-size: 13px; color: rgba(15, 23, 42, 0.7); font-weight: 500;">Respuesta:</span>
          <span style="font-size: 13px; font-weight: 600; color: ${data.color};">${data.responseTime}</span>
        </div>
      </div>
    `;

    L.marker([data.lat, data.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: true,
        maxWidth: 280
      });
  }

  private addCoverageCircle(map: L.Map, data: MapMarkerData): void {
    // Radius proportional to operations (scaled for visual clarity)
    const baseRadius = 15000;
    const scaledRadius = baseRadius + (data.operations / 4500) * 35000;

    L.circle([data.lat, data.lng], {
      radius: scaledRadius,
      color: data.color,
      weight: 1.5,
      opacity: 0.5,
      fillColor: data.color,
      fillOpacity: 0.08,
      dashArray: '6, 8'
    }).addTo(map);
  }
}
