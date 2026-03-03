import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import {
  FiGlobe, FiX,
  FiTrendingUp, FiUsers,
  FiCheckCircle, FiAlertCircle, FiMapPin, FiCalendar,
  FiZoomIn, FiZoomOut, FiRefreshCw,
} from 'react-icons/fi';

import type { DiseaseHotspot } from '../../../types/dashboard/types';
import { hotspotsService } from '../../../services/api/hostpots/hotspots';
import { GEO_URL, DISEASE_COLORS } from './constants';

const MAP_HEIGHT = 380;
const FALLBACK_COLOR = '#95a5a6';

function markerRadius(totalCases: number): number {
  return Math.min(Math.max(totalCases / 80 + 2, 3), 9);
}

function ColorDot({ color, extraClass = '' }: Readonly<{ color: string; extraClass?: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { ref.current?.style.setProperty('--dot-c', color); }, [color]);
  return <span ref={ref} className={`inline-block h-2 w-2 rounded-full bg-(--dot-c) ${extraClass}`.trim()} />;
}

function DiseaseFilterButton({
  label, color, active, onClick,
}: Readonly<{ label: string; color: string; active: boolean; onClick: () => void }>) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { ref.current?.style.setProperty('--btn-c', color); }, [color]);
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${active ? 'bg-(--btn-c) text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
        }`}
    >
      {label}
    </button>
  );
}

function ProgressBar({ pct }: Readonly<{ pct: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.style.setProperty('--pct', `${pct}%`); }, [pct]);
  return <div ref={ref} className="h-full rounded-full bg-[#2ECC71] transition-all w-(--pct)" />;
}

type WorldTopology = Topology<{
  countries: GeometryCollection;
  land: GeometryCollection;
}>;

function DashboardWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const topologyRef = useRef<WorldTopology | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [hotspots, setHotspots] = useState<DiseaseHotspot[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DiseaseHotspot | null>(null);
  const [tooltip, setTooltip] = useState<{ spot: DiseaseHotspot; x: number; y: number } | null>(null);
  const [activeDisease, setActiveDisease] = useState<string>('all');
  const [width, setWidth] = useState(800);

  const diseaseColorMap = useMemo(
    () => new Map(hotspots.map(h => [h.disease, h.color])),
    [hotspots],
  );

  const filtered = activeDisease === 'all'
    ? hotspots
    : hotspots.filter(h => h.disease === activeDisease);

  const totalCases = hotspots.reduce((sum, h) => sum + h.totalCases, 0);
  const totalActive = hotspots.reduce((sum, h) => sum + h.activeCases, 0);

  // Liste stable des maladies connues — toujours affichée dans les filtres
  const knownDiseases = useMemo(
    () => Object.keys(DISEASE_COLORS).sort((a, b) => a.localeCompare(b)),
    [],
  );

  useEffect(() => {
    hotspotsService.getAll()
      .then(res => {
        setHotspots(res.data);
        // Fusionner les maladies retournées avec les maladies connues
        const fromApi = res.data.map(h => h.disease);
        const merged = [...new Set([...knownDiseases, ...fromApi])].sort((a, b) => a.localeCompare(b));
        setDiseases(merged);
      })
      .catch(err => {
        setFetchError((err as Error).message);
        // En cas d'erreur réseau, les filtres restent visibles depuis les maladies connues
        setDiseases(knownDiseases);
      })
      .finally(() => setLoading(false));
  }, [knownDiseases]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(Math.floor(w));
    });
    ro.observe(el);
    setWidth(el.clientWidth || 800);
    return () => ro.disconnect();
  }, []);

  const makeProjection = useCallback(
    () =>
      d3
        .geoMercator()
        .scale(width / 6.8)
        .center([10, 15])
        .translate([width / 2, MAP_HEIGHT / 2]),
    [width],
  );

  const drawMap = useCallback(
    (topology: WorldTopology) => {
      const svgEl = svgRef.current;
      if (!svgEl) return;

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();

      const projection = makeProjection();
      const pathGen = d3.geoPath().projection(projection);
      const countries = feature(topology, topology.objects.countries);

      const g = svg.append('g').attr('class', 'map-root');

      g
        .selectAll<SVGPathElement, (typeof countries.features)[0]>('path.country')
        .data(countries.features)
        .join('path')
        .attr('class', 'country')
        .attr('d', pathGen as d3.ValueFn<SVGPathElement, (typeof countries.features)[0], string>)
        .attr('fill', '#1e293b')
        .attr('stroke', '#334155')
        .attr('stroke-width', 0.4)
        .on('mouseover', function () { d3.select(this).attr('fill', '#273549'); })
        .on('mouseout', function () { d3.select(this).attr('fill', '#1e293b'); });

      filtered.forEach(spot => {
        const coords = projection(spot.coordinates);
        if (!coords) return;
        const [cx, cy] = coords;
        const r = markerRadius(spot.totalCases);

        const markerG = g
          .append('g')
          .attr('class', 'hotspot')
          .attr('transform', `translate(${cx},${cy})`)
          .style('cursor', 'pointer');

        const pulse = markerG
          .append('circle')
          .attr('r', r)
          .attr('fill', spot.color)
          .attr('fill-opacity', 0.25)
          .attr('stroke', 'none');

        const animatePulse = () => {
          pulse
            .attr('r', r)
            .attr('fill-opacity', 0.25)
            .transition()
            .duration(1800)
            .ease(d3.easeSinOut)
            .attr('r', r + 8)
            .attr('fill-opacity', 0)
            .on('end', animatePulse);
        };
        animatePulse();

        markerG
          .append('circle')
          .attr('r', r)
          .attr('fill', spot.color)
          .attr('stroke', '#0f172a')
          .attr('stroke-width', 1.2)
          .on('mouseover', (event: MouseEvent) => {
            const [mx, my] = d3.pointer(event, svgEl);
            setTooltip({ spot, x: mx, y: my });
          })
          .on('mouseout', () => setTooltip(null))
          .on('click', () => { setSelected(spot); setTooltip(null); });
      });

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.8, 8])
        .on('zoom', event => {
          g.attr('transform', event.transform.toString());
        });

      svg.call(zoom);
      zoomRef.current = zoom;
    },
    [filtered, makeProjection],
  );

  useEffect(() => {
    if (topologyRef.current) {
      drawMap(topologyRef.current);
      return;
    }
    fetch(GEO_URL)
      .then(r => r.json())
      .then((topo: WorldTopology) => {
        topologyRef.current = topo;
        drawMap(topo);
      })
      .catch(console.error);
  }, [drawMap]);

  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selected]);

  useEffect(() => {
    const el = modalRef.current;
    if (!el || !selected) return;
    el.style.setProperty('--sel-c', selected.color);
    el.style.setProperty('--icon-bg', `${selected.color}25`);
    el.style.setProperty('--tag-border', `${selected.color}50`);
    el.style.setProperty('--tag-bg', `${selected.color}10`);
  }, [selected]);

  const tooltipCallbackRef = useCallback((el: HTMLDivElement | null) => {
    if (!el || !tooltip) return;
    el.style.left = `${Math.min(tooltip.x + 12, width - 216)}px`;
    el.style.top = `${Math.max(tooltip.y - 70, 4)}px`;
  }, [tooltip, width]);

  const zoomIn = () => {
    if (svgRef.current && zoomRef.current)
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
  };

  const zoomOut = () => {
    if (svgRef.current && zoomRef.current)
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
  };

  return (
    <div className="rounded-xl bg-gray-900 text-white overflow-hidden shadow-xl relative">

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-[#3a7bd5] to-[#2ECC71]">
            <FiGlobe size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-none">Carte épidémiologique mondiale</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {hotspots.length} foyers — {diseases.length} maladies — tous les continents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <FiUsers size={13} className="text-[#3a7bd5]" />
            <span className="font-bold">{totalCases.toLocaleString('fr-FR')}</span>
            <span className="text-gray-400">total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiTrendingUp size={13} className="text-[#E74C3C]" />
            <span className="font-bold text-[#E74C3C]">{totalActive.toLocaleString('fr-FR')}</span>
            <span className="text-gray-400">actifs</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-700/50 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveDisease('all')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeDisease === 'all' ? 'bg-[#3a7bd5] text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
        >
          Toutes
        </button>
        {diseases.map(d => (
          <DiseaseFilterButton
            key={d}
            label={d}
            color={diseaseColorMap.get(d) ?? DISEASE_COLORS[d] ?? FALLBACK_COLOR}
            active={activeDisease === d}
            onClick={() => setActiveDisease(d)}
          />
        ))}
      </div>

      <div ref={containerRef} className="relative overflow-hidden h-95">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#0f172a]/80">
            <FiRefreshCw size={22} className="animate-spin text-[#3a7bd5]" />
            <span className="text-xs text-gray-400">Chargement des données épidémiologiques…</span>
          </div>
        )}
        {!loading && fetchError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#0f172a]/90">
            <FiAlertCircle size={22} className="text-[#E74C3C]" />
            <span className="text-xs text-gray-300">Impossible de charger les hotspots</span>
            <span className="text-[10px] text-gray-500">{fetchError}</span>
          </div>
        )}
        <svg
          ref={svgRef}
          width={width}
          height={MAP_HEIGHT}
          className="block bg-[#0f172a]"
        />

        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={zoomIn}
            aria-label="Zoom avant"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800/90 hover:bg-gray-700 border border-gray-600 text-gray-300 transition-colors"
          >
            <FiZoomIn size={13} />
          </button>
          <button
            onClick={zoomOut}
            aria-label="Zoom arrière"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800/90 hover:bg-gray-700 border border-gray-600 text-gray-300 transition-colors"
          >
            <FiZoomOut size={13} />
          </button>
        </div>

        {tooltip && !selected && (
          <div
            ref={tooltipCallbackRef}
            className="pointer-events-none absolute z-10 max-w-50 rounded-lg border border-gray-600 bg-gray-800/95 px-3 py-2 shadow-xl"
          >
            <div className="mb-1 flex items-center gap-1.5">
              <ColorDot color={tooltip.spot.color} extraClass="shrink-0" />
              <span className="text-xs font-bold text-white">{tooltip.spot.disease}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FiMapPin size={10} />
              <span>{tooltip.spot.city}, {tooltip.spot.country}</span>
            </div>
            <p className="mt-1 text-xs text-gray-300">
              <span className="font-semibold text-white">{tooltip.spot.totalCases.toLocaleString('fr-FR')}</span>
              {' '}cas ·{' '}
              <span className="font-semibold text-[#E74C3C]">{tooltip.spot.activeCases.toLocaleString('fr-FR')}</span>
              {' '}actifs
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500">Cliquer pour les détails</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 border-t border-gray-700/50">
        {diseases.map(d => (
          <div key={d} className="flex items-center gap-1.5">
            <ColorDot color={diseaseColorMap.get(d) ?? DISEASE_COLORS[d] ?? FALLBACK_COLOR} />
            <span className="text-xs text-gray-400">{d}</span>
          </div>
        ))}
      </div>

      {selected && (
        <dialog
          open
          aria-label={`Détails — ${selected.disease}`}
          className="fixed inset-0 z-50 m-0 h-full w-full max-w-none border-none bg-transparent p-0"
        >
          <button
            type="button"
            aria-label="Fermer le dialogue"
            className="absolute inset-0 w-full bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <div
              ref={modalRef}
              className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
            >
              <div className="h-1 w-full bg-(--sel-c)" />

              <div className="flex items-start justify-between border-b border-gray-700 px-5 pb-4 pt-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--icon-bg)"
                  >
                    <FiAlertCircle size={20} className="text-(--sel-c)" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold leading-none text-(--sel-c)">
                      {selected.disease}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                      <FiMapPin size={10} />
                      <span>{selected.city}, {selected.country}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Fermer"
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="space-y-4 px-5 py-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-gray-800 p-3 text-center">
                    <div className="mb-1 flex justify-center"><FiUsers size={14} className="text-gray-400" /></div>
                    <p className="text-lg font-bold text-white">{selected.totalCases.toLocaleString('fr-FR')}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">Total</p>
                  </div>
                  <div className="rounded-xl bg-gray-800 p-3 text-center">
                    <div className="mb-1 flex justify-center"><FiAlertCircle size={14} className="text-[#E74C3C]" /></div>
                    <p className="text-lg font-bold text-[#E74C3C]">{selected.activeCases.toLocaleString('fr-FR')}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">Actifs</p>
                  </div>
                  <div className="rounded-xl bg-gray-800 p-3 text-center">
                    <div className="mb-1 flex justify-center"><FiCheckCircle size={14} className="text-[#2ECC71]" /></div>
                    <p className="text-lg font-bold text-[#2ECC71]">{selected.curedCases.toLocaleString('fr-FR')}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">Guéris</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-400">
                    <span>Taux de guérison</span>
                    <span className="font-semibold text-[#2ECC71]">
                      {Math.round((selected.curedCases / selected.totalCases) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <ProgressBar pct={Math.round((selected.curedCases / selected.totalCases) * 100)} />
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-gray-300">{selected.description}</p>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Symptômes principaux</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.symptoms.map(s => (
                      <span
                        key={s}
                        className="rounded-full border px-2.5 py-1 text-xs font-medium border-(--tag-border) text-(--sel-c) bg-(--tag-bg)"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-700 pt-2 text-xs text-gray-500">
                  <FiCalendar size={11} />
                  <span>Dernière mise à jour : <span className="text-gray-300">{selected.lastUpdated}</span></span>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}

    </div>
  );
}

export default DashboardWorld;
