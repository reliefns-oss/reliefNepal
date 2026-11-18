'use client';

import { useEffect, useRef, useState } from 'react';

const workAreas = [
  {
    province: 'Bagmati Province',
    districts: [
      { id: 'sindhuli', name: 'Sindhuli' },
      { id: 'kathmandu', name: 'Kathmandu' },
      { id: 'kavrepalanchok', name: 'Kavrepalanchok' },
      { id: 'sindhupalchok', name: 'Sindhupalchok' },
      { id: 'lalitpur', name: 'Lalitpur' },
    ],
  },
  {
    province: 'Madhesh Province',
    districts: [
      { id: 'mahottari', name: 'Mahottari' },
      { id: 'sarlahi', name: 'Sarlahi' },
      { id: 'rautahat', name: 'Rautahat' },
      { id: 'bara', name: 'Bara' },
    ],
  },
  {
    province: 'Karnali Province',
    districts: [{ id: 'jajarkot', name: 'Jajarkot' }],
  },
];

const districtsById = Object.fromEntries(
  workAreas.flatMap(({ province, districts }) =>
    districts.map((district) => [district.id, { ...district, province }]),
  ),
);

const districtCount = Object.keys(districtsById).length;
const provinceCount = workAreas.length;

function getDistrictFromTarget(target) {
  return target instanceof Element
    ? target.closest('.working-district')?.dataset.district || null
    : null;
}

export default function DistrictMapSection() {
  const mapRef = useRef(null);
  const [svgMarkup, setSvgMarkup] = useState('');
  const [mapError, setMapError] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Load the SVG map once.
  useEffect(() => {
    let active = true;
    fetch('/images/nepal-active-districts.svg?v=3', { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('Map unavailable');
        return response.text();
      })
      .then((markup) => {
        if (active) setSvgMarkup(markup);
      })
      .catch(() => {
        if (active) setMapError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Delegated listeners on the map container. They are attached once, so they
  // keep working when the SVG markup is injected and are always cleaned up.
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return undefined;

    const toggle = (district) =>
      setSelectedDistrict((current) =>
        current === district ? null : district,
      );

    const onPointerOver = (event) =>
      setHoveredDistrict(getDistrictFromTarget(event.target));
    const onPointerLeave = () => setHoveredDistrict(null);
    const onFocusIn = (event) => {
      const district = getDistrictFromTarget(event.target);
      if (district) setHoveredDistrict(district);
    };
    const onFocusOut = (event) => {
      if (!mapElement.contains(event.relatedTarget)) setHoveredDistrict(null);
    };
    const onClick = (event) => {
      const district = getDistrictFromTarget(event.target);
      if (district) {
        toggle(district);
        setHoveredDistrict(district);
      }
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const district = getDistrictFromTarget(event.target);
      if (!district) return;
      event.preventDefault();
      toggle(district);
      setHoveredDistrict(district);
    };

    mapElement.addEventListener('pointerover', onPointerOver);
    mapElement.addEventListener('pointerleave', onPointerLeave);
    mapElement.addEventListener('focusin', onFocusIn);
    mapElement.addEventListener('focusout', onFocusOut);
    mapElement.addEventListener('click', onClick);
    mapElement.addEventListener('keydown', onKeyDown);
    return () => {
      mapElement.removeEventListener('pointerover', onPointerOver);
      mapElement.removeEventListener('pointerleave', onPointerLeave);
      mapElement.removeEventListener('focusin', onFocusIn);
      mapElement.removeEventListener('focusout', onFocusOut);
      mapElement.removeEventListener('click', onClick);
      mapElement.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const activeDistrict = hoveredDistrict || selectedDistrict;

  // Keep the SVG in sync with state: selected, active (hover or list focus),
  // and the floating district label.
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;
    mapElement.querySelectorAll('.working-district').forEach((path) => {
      const id = path.dataset.district;
      const isSelected = id === selectedDistrict;
      path.classList.toggle('is-selected', isSelected);
      path.classList.toggle('is-active', id === activeDistrict);
      path.setAttribute('aria-pressed', String(isSelected));
    });
    mapElement.querySelectorAll('.district-label').forEach((label) => {
      label.classList.toggle(
        'is-active',
        label.dataset.district === activeDistrict,
      );
    });
  }, [svgMarkup, selectedDistrict, activeDistrict]);

  function selectDistrict(id) {
    const next = selectedDistrict === id ? null : id;
    setSelectedDistrict(next);
    setHoveredDistrict(next);
  }

  const activeInfo = activeDistrict ? districtsById[activeDistrict] : null;

  return (
    <section
      id="where-we-work"
      aria-labelledby="district-map-title"
      className="bg-[#f4f7f3] py-14 text-[#183a2a] sm:py-20"
    >
      <div className="rn-container">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,.75fr)] lg:gap-12">
          <div>
            <div className="mb-5 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-700">
                Where we work
              </p>
              <h2
                id="district-map-title"
                className="mt-2 text-3xl font-bold text-forest-950 sm:text-4xl"
              >
                Rooted in communities across Nepal.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Explore the {districtCount} districts where Relief Nepal works.
                Hover over or select a highlighted district to locate it on the
                map.
              </p>
            </div>

            <div
              ref={mapRef}
              className="relative overflow-hidden rounded-2xl border border-forest-100 bg-gradient-to-br from-white via-white to-[#eef4ec] p-2 shadow-sm sm:p-4 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
            >
              {svgMarkup ? (
                <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
              ) : (
                <div
                  className="grid aspect-[1240/780] place-items-center text-sm text-slate-500"
                  role="status"
                >
                  {mapError
                    ? 'The district map could not be loaded.'
                    : 'Loading the district map…'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="grid grid-cols-2 gap-3 border-b border-forest-100 pb-5">
              <div className="rounded-xl bg-forest-50 px-4 py-3">
                <p className="text-3xl font-bold leading-none text-forest-900">
                  {districtCount}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-forest-700">
                  Districts
                </p>
              </div>
              <div className="rounded-xl bg-forest-50 px-4 py-3">
                <p className="text-3xl font-bold leading-none text-forest-900">
                  {provinceCount}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-forest-700">
                  Provinces
                </p>
              </div>
            </div>

            <div className="min-h-[5.5rem] border-b border-forest-100 py-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">
                Selected district
              </p>
              <p
                className="mt-1 text-xl font-bold text-forest-900"
                aria-live="polite"
              >
                {activeInfo
                  ? activeInfo.name
                  : `All ${districtCount} districts`}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {activeInfo ? activeInfo.province : 'Across three provinces'}
              </p>
            </div>

            <div className="mt-4 space-y-5">
              {workAreas.map(({ province, districts }) => (
                <div key={province}>
                  <h3 className="text-xs font-bold uppercase tracking-[.14em] text-forest-700">
                    {province}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {districts.map(({ id, name }) => {
                      const isSelected = selectedDistrict === id;
                      const isActive = activeDistrict === id;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onMouseEnter={() => setHoveredDistrict(id)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            onFocus={() => setHoveredDistrict(id)}
                            onBlur={() => setHoveredDistrict(null)}
                            onClick={() => selectDistrict(id)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 ${
                              isSelected
                                ? 'border-forest-900 bg-amber-300 font-semibold text-forest-950 shadow-sm'
                                : isActive
                                  ? 'border-forest-700 bg-amber-200 text-forest-950 shadow-sm'
                                  : 'border-forest-100 bg-forest-50 text-forest-800 hover:border-forest-300 hover:bg-amber-100'
                            }`}
                          >
                            {name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <p className="text-xs leading-5 text-slate-500">
                Select a district on the map or in this list to highlight it.
                Select it again to clear your selection.
              </p>
              {selectedDistrict && (
                <button
                  type="button"
                  onClick={() => selectDistrict(selectedDistrict)}
                  className="shrink-0 rounded-full border border-forest-100 px-3 py-1 text-xs font-semibold text-forest-800 transition hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
