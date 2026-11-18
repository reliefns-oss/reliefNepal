'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './orgstructure.module.css';

const BASE_EDGES = [
  {
    id: 'assembly-committee',
    from: 'assembly',
    to: 'committee',
    type: 'reports',
  },
  {
    id: 'advisory-committee',
    from: 'advisory',
    to: 'committee',
    type: 'works',
  },
  {
    id: 'committee-director',
    from: 'committee',
    to: 'director',
    type: 'reports',
  },
  { id: 'director-audit', from: 'director', to: 'audit', type: 'works' },
];

export default function OrgStructure({ organization = [] }) {
  const chartRef = useRef(null);
  const nodeRefs = useRef({});
  const [paths, setPaths] = useState({});
  const [size, setSize] = useState({ width: 0, height: 0 });

  const edges = useMemo(
    () => [
      ...BASE_EDGES,
      ...organization.map((_, index) => ({
        id: `director-department-${index}`,
        from: 'director',
        to: `department-${index}`,
        type: 'reports',
      })),
    ],
    [organization],
  );

  const setNodeRef = useCallback(
    (id) => (element) => {
      if (element) nodeRefs.current[id] = element;
      else delete nodeRefs.current[id];
    },
    [],
  );

  const measure = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const bounds = chart.getBoundingClientRect();
    const rect = (id) => {
      const element = nodeRefs.current[id];
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: box.left - bounds.left,
        right: box.right - bounds.left,
        top: box.top - bounds.top,
        bottom: box.bottom - bounds.top,
        cx: box.left - bounds.left + box.width / 2,
        cy: box.top - bounds.top + box.height / 2,
      };
    };

    const nextPaths = {};
    edges.forEach((edge) => {
      const parent = rect(edge.from);
      const child = rect(edge.to);
      if (!parent || !child) return;

      if (edge.type === 'works') {
        const [left, right] =
          parent.cx < child.cx ? [parent, child] : [child, parent];
        nextPaths[edge.id] = `M${left.right} ${left.cy}H${right.left}`;
      } else {
        const middle = parent.bottom + (child.top - parent.bottom) / 2;
        nextPaths[edge.id] =
          `M${parent.cx} ${parent.bottom}V${middle}H${child.cx}V${child.top}`;
      }
    });

    setPaths(nextPaths);
    setSize({ width: bounds.width, height: bounds.height });
  }, [edges]);

  useEffect(() => {
    measure();
    const chart = chartRef.current;
    if (!chart) return undefined;

    const observer = new ResizeObserver(measure);
    observer.observe(chart);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return (
    <div
      ref={chartRef}
      className={styles.chart}
      role="group"
      aria-label="Relief Nepal organizational structure"
    >
      <svg
        className={styles.connectors}
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width || 1} ${size.height || 1}`}
        aria-hidden="true"
      >
        <defs>
          <marker
            id="organization-chart-arrow"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M1 1L10 6L1 11Z" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const path = paths[edge.id];
          if (!path) return null;
          return (
            <path
              key={edge.id}
              d={path}
              className={styles.connector}
              markerEnd={
                edge.type === 'reports'
                  ? 'url(#organization-chart-arrow)'
                  : undefined
              }
            />
          );
        })}
      </svg>

      <div className={styles.content}>
        <Node
          id="assembly"
          label="General Assembly"
          tone="governance"
          setRef={setNodeRef('assembly')}
        />
        <ArrowDown />

        <div className={`${styles.row} ${styles.committeeRow}`}>
          <Node
            id="advisory"
            label="Advisory Committee"
            tone="governance"
            setRef={setNodeRef('advisory')}
          />
          <ArrowDown />
          <Node
            id="committee"
            label="Executive Committee"
            tone="governance"
            setRef={setNodeRef('committee')}
          />
        </div>
        <ArrowDown />

        <div className={`${styles.row} ${styles.directorRow}`}>
          <Node
            id="director"
            label="Executive Director"
            tone="leadership"
            setRef={setNodeRef('director')}
          />
          <ArrowDown />
          <Node
            id="audit"
            label="Internal Audit"
            tone="leadership"
            setRef={setNodeRef('audit')}
          />
        </div>
        <ArrowDown />

        <div className={styles.departmentGrid}>
          {organization.map((department, index) => (
            <article
              key={department.title}
              ref={setNodeRef(`department-${index}`)}
              className={styles.department}
            >
              <h3>{department.title}</h3>
              <ul>
                {department.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Node({ id, label, tone, setRef }) {
  return (
    <div
      id={`organization-${id}`}
      ref={setRef}
      className={`${styles.node} ${styles[tone]}`}
    >
      <strong>{label}</strong>
    </div>
  );
}

function ArrowDown({ className = '' }) {
  return (
    <svg
      className={`${styles.downArrow} ${styles.mobileArrow} ${className}`}
      viewBox="0 0 24 28"
      aria-hidden="true"
    >
      <path d="M12 1v20m-7-7 7 7 7-7" />
    </svg>
  );
}
