'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

/** Tiny i18n */
const translations = {
  en: {
    // Top bar
    addElement: 'Add element',
    prepareCutList: 'Prepare cut list',

    // Tables common
    items_one: 'item',
    items_other: 'items',
    noDataYet: 'No data yet — click',
    toGetStarted: 'to get started.',
    noCutYet: 'No cut list yet — click',
    prepareCutListShort: 'Prepare cut list',
    actions: 'Actions',

    // Element table
    upperElements: 'Upper elements',
    lowerElements: 'Lower elements',
    hash: '#',
    width: 'Width (mm)',
    height: 'Height (mm)',
    depth: 'Depth (mm)',
    doors: 'Doors',
    shelves: 'Shelves',
    edit: 'Edit',
    remove: 'Remove',
    confirmRemove: 'Remove this element?',

    // Cut list
    cutList: 'Cut list',
    boxParts: 'Box parts',
    doorParts: 'Door parts',
    backParts: 'Back parts',
    qty: 'Qty',
    absShort: 'ABS short',
    absLong: 'ABS long',
    decor: 'Decor',
    absDecor: 'ABS decor',

    // Add/Edit modal
    addElementTitle: 'Add Element',
    editElementTitle: 'Edit Element',
    type: 'Type',
    typeUpper: 'Upper elements',
    typeLower: 'Lower elements',
    widthPh: 'e.g. 600',
    heightPh: 'e.g. 720',
    depthPh: 'e.g. 320',
    doorsPh: 'e.g. 2',
    shelvesPh: 'e.g. 3',
    golaProfile: 'Gola profile',
    doorHeight: 'Door height (mm)',          // <-- added
    doorHeightPh: 'e.g. 710',                // <-- added
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',

    // Cut modal
    prepareCutListTitle: 'Prepare cut list',
    frontDecor: 'Front decor',
    frontDecorPh: 'e.g. U999 ST19',
    frontAbsDecor: 'Front ABS decor',
    frontAbsDecorPh: 'e.g. U999 ABS',
    boxDecor: 'Box decor',
    boxDecorPh: 'e.g. W980 ST2',
    boxAbsDecor: 'Box ABS decor',
    boxAbsDecorPh: 'e.g. W980 ABS',
    continue: 'Continue',

    // Lang toggle
    language: 'Language',
    english: 'English',
    croatian: 'Croatian',
  },
  hr: {
    // Top bar
    addElement: 'Dodaj element',
    prepareCutList: 'Pripremi krojnu listu',

    // Tables common
    items_one: 'stavka',
    items_other: 'stavki',
    noDataYet: 'Još nema podataka — kliknite',
    toGetStarted: 'za početak.',
    noCutYet: 'Nema generirane liste — kliknite',
    prepareCutListShort: 'Pripremi listu',
    actions: 'Radnje',

    // Element table
    upperElements: 'Gornji elementi',
    lowerElements: 'Donji elementi',
    hash: '#',
    width: 'Širina (mm)',
    height: 'Visina (mm)',
    depth: 'Dubina (mm)',
    doors: 'Vrata',
    shelves: 'Police',
    edit: 'Uredi',
    remove: 'Ukloni',
    confirmRemove: 'Ukloniti ovaj element?',

    // Cut list
    cutList: 'Krojna lista',
    boxParts: 'Dijelovi korpusa',
    doorParts: 'Dijelovi fronti',
    backParts: 'Leđa',
    qty: 'Kom',
    absShort: 'ABS kratka',
    absLong: 'ABS duga',
    decor: 'Dekor',
    absDecor: 'ABS dekor',

    // Add/Edit modal
    addElementTitle: 'Dodavanje elementa',
    editElementTitle: 'Uređivanje elementa',
    type: 'Tip',
    typeUpper: 'Gornji elementi',
    typeLower: 'Donji elementi',
    widthPh: 'npr. 600',
    heightPh: 'npr. 720',
    depthPh: 'npr. 320',
    doorsPh: 'npr. 2',
    shelvesPh: 'npr. 3',
    golaProfile: 'Gola profil',
    doorHeight: 'Visina vrata (mm)',         // <-- added
    doorHeightPh: 'npr. 710',                // <-- added
    cancel: 'Odustani',
    save: 'Spremi',
    update: 'Ažuriraj',

    // Cut modal
    prepareCutListTitle: 'Pripremi krojnu listu',
    frontDecor: 'Dekor fronti',
    frontDecorPh: 'npr. U999 ST19',
    frontAbsDecor: 'ABS dekor fronti',
    frontAbsDecorPh: 'npr. U999 ABS',
    boxDecor: 'Dekor korpusa',
    boxDecorPh: 'npr. W980 ST2',
    boxAbsDecor: 'ABS dekor korpusa',
    boxAbsDecorPh: 'npr. W980 ABS',
    continue: 'Nastavi',

    // Lang toggle
    language: 'Jezik',
    english: 'Engleski',
    croatian: 'Hrvatski',
  },
};

export default function Page() {
  // Language
  const [lang, setLang] = useState('en'); // 'en' | 'hr'
  const t = useMemo(() => translations[lang], [lang]);
  const itemsLabel = (n) => `${n} ${n === 1 ? t.items_one : t.items_other}`;

  // Add/Edit element modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = adding, number = editing row (index in full elements array)
  const addCloseBtnRef = useRef(null);

  // Prepare cut list modal
  const [isCutOpen, setIsCutOpen] = useState(false);
  const cutCloseBtnRef = useRef(null);

  // Elements
  const [elements, setElements] = useState([]);

  // Form state (element)
  const [elementType, setElementType] = useState('upper'); // 'upper' | 'lower'
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [doors, setDoors] = useState('');
  const [shelves, setShelves] = useState('');
  const [golaProfile, setGolaProfile] = useState(false); // kept for lower elements (not shown in tables)
  const [doorHeight, setDoorHeight] = useState('');      // <-- added (only for lower + gola)

  // Form state (cut list modal)
  const [frontDecor, setFrontDecor] = useState('');
  const [frontAbsDecor, setFrontAbsDecor] = useState('');
  const [boxDecor, setBoxDecor] = useState('');
  const [boxAbsDecor, setBoxAbsDecor] = useState('');

  // Cut list results
  const [cutLists, setCutLists] = useState({ box: [], door: [], back: [] });
  const [cutTab, setCutTab] = useState('box'); // 'box' | 'door' | 'back'

  // Helpers
  const uppers = elements.filter((e) => e.type === 'upper');
  const lowers = elements.filter((e) => e.type === 'lower');

  // Accessibility focus + ESC for Add/Edit modal
  useEffect(() => {
    if (isAddOpen) {
      addCloseBtnRef.current?.focus();
      const onKey = (e) => e.key === 'Escape' && handleCancelAdd();
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [isAddOpen]);

  // Accessibility focus + ESC for Cut List modal
  useEffect(() => {
    if (isCutOpen) {
      cutCloseBtnRef.current?.focus();
      const onKey = (e) => e.key === 'Escape' && handleCancelCut();
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [isCutOpen]);

  const resetElementForm = () => {
    setElementType('upper');
    setWidth('');
    setHeight('');
    setDepth('');
    setDoors('');
    setShelves('');
    setGolaProfile(false);
    setDoorHeight('');         // <-- added
    setEditingIndex(null);
  };

  const resetCutForm = () => {
    setFrontDecor('');
    setFrontAbsDecor('');
    setBoxDecor('');
    setBoxAbsDecor('');
  };

  const handleCancelAdd = () => {
    setIsAddOpen(false);
    resetElementForm();
  };

  const handleCancelCut = () => {
    setIsCutOpen(false);
    // Keep values or clear? Keeping them is user-friendly; change to resetCutForm() if you want to clear.
  };

  const openAdd = () => {
    resetElementForm();
    setIsAddOpen(true);
  };

  const openEdit = (index) => {
    const el = elements[index];
    console.log(el);
    setEditingIndex(index);
    setElementType(el.type);
    setWidth(String(el.width));
    setHeight(String(el.height));
    setDepth(String(el.depth));
    setDoors(String(el.doors ?? ''));
    setShelves(String(el.shelves ?? ''));
    setGolaProfile(!!el.gola);
    setDoorHeight(el.doorHeight != null ? String(el.doorHeight) : ''); // <-- added
    setIsAddOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm(t.confirmRemove)) {
      setElements((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveElement = (e) => {
    e.preventDefault();

    const el = {
      type: elementType,
      width: Number(width),
      height: Number(height),
      depth: Number(depth),
      doors: Number(doors) || 0,
      shelves: Number(shelves) || 0,
      gola: golaProfile,
      // Save only when applicable and provided:
      doorHeight:
        elementType === 'lower' && golaProfile && doorHeight !== ''
          ? Number(doorHeight)
          : undefined, // <-- added
    };

    if (!el.width || !el.height || !el.depth) return;

    setElements((prev) => {
      if (editingIndex === null) {
        return [...prev, el];
      } else {
        const next = [...prev];
        next[editingIndex] = el;
        return next;
      }
    });

    setIsAddOpen(false);
    resetElementForm();
  };

  const handlePrepareCutList = (e) => {
    e.preventDefault();
    buildCutList();
    setIsCutOpen(false);
  };

  const normalizePart = (qty, x, y, absShort, absLong, extra = {}) => {
    const width = x > y ? x : y;
    const height = x > y ? y : x;
    return {
      quantity: qty,
      width,
      height,
      abs_short: absShort,
      abs_long: absLong,
      ...extra,
    };
  };

  const buildCutList = () => {
    const doorParts = [];
    const boxParts = [];
    const backParts = [];

    elements.forEach((el) => {
      console.log(el);
      if (el.type === 'upper') {
        // Sides
        {
          const x = el.height;
          const y = el.depth;
          boxParts.push(
            normalizePart(
              2,
              x,
              y,
              x > y ? 2 : 1,
              x > y ? 1 : 2,
            )
          );
        }

        // Top/Bottom
        {
          const x = el.width - 36;
          const y = el.depth;
          boxParts.push(
            normalizePart(
              2,
              x,
              y,
              x > y ? 0 : 1,
              x > y ? 1 : 0,
            )
          );
        }

        // Gola rail (or bottom rail)
        {
          const x = el.width - 36;
          const y = 100;
          boxParts.push(
            normalizePart(
              1,
              x,
              y,
              x > y ? 0 : 1,
              x > y ? 1 : 0,
            )
          );
        }

        // Shelves
        if (el.shelves) {
          const x = el.width - 38;
          const y = 280;
          boxParts.push(
            normalizePart(
              el.shelves,
              x,
              y,
              x > y ? 0 : 1,
              x > y ? 1 : 0,
            )
          );
        }

        // Doors
        if (el.doors !== 0) {
          if (el.doors === 1) {
            const x = el.width - 4;
            const y = el.height - 4;
            doorParts.push(
              normalizePart(
                1,
                x,
                y,
                2,
                2,
              )
            );
          } else if (el.doors === 2) {
            const x = el.width / 2 - 4;
            const y = el.height - 4;
            doorParts.push(
              normalizePart(
                2,
                x,
                y,
                2,
                2,
              )
            );
          }
        }

        // Back
        {
          const x = el.width;
          const y = el.height;
          backParts.push(
            normalizePart(1, x, y, 0, 0)
          );
        }
      } else if (el.type === "lower") {
        if (el.gola === false) {
          {
            const x = 702;
            const y = 557;
            boxParts.push(
              normalizePart(
                2,
                x,
                y,
                x > y ? 2 : 1,
                x > y ? 1 : 2,
              )
            );
          }
          {
            const x = el.width;
            const y = 557;
            boxParts.push(
              normalizePart(
                1,
                x,
                y,
                x > y ? 0 : 1,
                x > y ? 1 : 0,
              )
            );
          }
          // Support
          {
            const x = el.width - 36;
            const y = 80;
            boxParts.push(
              normalizePart(
                2,
                x,
                y,
                x > y ? 0 : 1,
                x > y ? 1 : 0,
              )
            );
          }
          if (el.doors !== 0) {
            if (el.doors === 1) {
              const x = el.width - 4;
              const y = el.height - 5;
              doorParts.push(
                normalizePart(
                  1,
                  x,
                  y,
                  2,
                  2,
                )
              );
            } else if (el.doors === 2) {
              const x = el.width / 2 - 4;
              const y = el.height - 5;
              doorParts.push(
                normalizePart(
                  2,
                  x,
                  y,
                  2,
                  2,
                )
              );
            }
          }
          if (el.shelves) {
            const x = el.width - 38;
            const y = 540;
            boxParts.push(
              normalizePart(
                el.shelves,
                x,
                y,
                x > y ? 0 : 1,
                x > y ? 1 : 0,
              )
            );
          }
          {
            const x = el.width;
            const y = el.height;
            backParts.push(
              normalizePart(1, x, y, 0, 0)
            );
          }
        } else {
          {
            const x = 751;
            const y = 557;
            boxParts.push(
              normalizePart(
                2,
                x,
                y,
                x > y ? 2 : 1,
                x > y ? 1 : 2,
              )
            );
          }
          {
            const x = el.width;
            const y = 557;
            boxParts.push(
              normalizePart(
                1,
                x,
                y,
                x > y ? 0 : 1,
                x > y ? 1 : 0,
              )
            );
          }
          // Support
          {
            const x = el.width - 36;
            const y = 80;
            boxParts.push(
              normalizePart(
                2,
                x,
                y,
                x > y ? 0 : 1,
                x > y ? 1 : 0,
              )
            );
          }
          if (el.doors !== 0) {
            if (el.doors === 1) {
              const x = el.width - 4;
              const y = el.doorHeight;
              doorParts.push(
                normalizePart(
                  1,
                  x,
                  y,
                  2,
                  2,
                )
              );
            } else if (el.doors === 2) {
              const x = el.width / 2 - 4;
              const y = el.doorHeigh;
              doorParts.push(
                normalizePart(
                  2,
                  x,
                  y,
                  2,
                  2,
                )
              );
            }
          }
          if (el.shelves) {
            const x = el.width - 38;
            const y = 540;
            boxParts.push(
              normalizePart(
                el.shelves,
                x,
                y,
                x > y ? 0 : 1,
                x > y ? 1 : 0,
              )
            );
          }
          {
            const x = el.width;
            const y = el.height;
            backParts.push(
              normalizePart(1, x, y, 0, 0)
            );
          }
        }
      }
    });

    const finalBoxParts = [];
    const finalDoorParts = [];
    const finalBackParts = [];

    boxParts.forEach(el => {
      const key = `${el.height}-${el.width}-${el.abs_long}-${el.abs_short}`;
      if (!finalBoxParts[key])
      {
        finalBoxParts[key] = el;
      } else {
        finalBoxParts[key].quantity += el.quantity;
      }
    });

    doorParts.forEach(el => {
      const key = `${el.height}-${el.width}-${el.abs_long}-${el.abs_short}`;
      if (!finalDoorParts[key])
      {
        finalDoorParts[key] = el;
      } else {
        finalDoorParts[key].quantity += el.quantity;
      }
    });

    backParts.forEach(el => {
      const key = `${el.height}-${el.width}-${el.abs_long}-${el.abs_short}`;
      if (!finalBackParts[key])
      {
        finalBackParts[key] = el;
      } else {
        finalBackParts[key].quantity += el.quantity;
      }
    });

    // Save to state
    setCutLists({
      box: Object.values(finalBoxParts),
      door: Object.values(finalDoorParts),
      back: Object.values(finalBackParts),
    });
  };

  // Render a table for elements
  const renderTable = (list, label) => {
    const rows = list.length;
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">{label}</h2>
          <span className="text-xs font-medium text-slate-500">
            {itemsLabel(rows)}
          </span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-t border-slate-200">
            <thead>
              <tr className="bg-slate-50/60 text-left text-sm text-slate-600">
                <th className="w-16 px-5 py-3 font-medium">{t.hash}</th>
                <th className="px-5 py-3 font-medium">{t.width}</th>
                <th className="px-5 py-3 font-medium">{t.height}</th>
                <th className="px-5 py-3 font-medium">{t.depth}</th>
                <th className="px-5 py-3 font-medium">{t.doors}</th>
                <th className="px-5 py-3 font-medium">{t.shelves}</th>
                <th className="w-40 px-5 py-3 font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {rows === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">
                    {t.noDataYet} <span className="font-medium text-slate-700">{t.addElement}</span> {t.toGetStarted}
                  </td>
                </tr>
              ) : (
                list.map((el, i) => {
                  const originalIndex = elements.findIndex((x) => x === el);
                  return (
                    <tr key={`${label}-${i}`} className="border-t border-slate-100 text-sm text-slate-700">
                      <td className="px-5 py-3">{i + 1}</td>
                      <td className="px-5 py-3">{el.width}</td>
                      <td className="px-5 py-3">{el.height}</td>
                      <td className="px-5 py-3">{el.depth}</td>
                      <td className="px-5 py-3">{el.doors}</td>
                      <td className="px-5 py-3">{el.shelves}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            onClick={() => openEdit(originalIndex)}
                          >
                            {t.edit}
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                            onClick={() => handleDelete(originalIndex)}
                          >
                            {t.remove}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  // Render a cut-list table for a given parts array
  const renderCutListTable = (parts, label) => {
    const rows = parts.length;
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">{label}</h2>
          <span className="text-xs font-medium text-slate-500">
            {itemsLabel(rows)}
          </span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-t border-slate-200">
            <thead>
              <tr className="bg-slate-50/60 text-left text-sm text-slate-600">
                <th className="w-16 px-5 py-3 font-medium">{t.hash}</th>
                <th className="px-5 py-3 font-medium">{t.qty}</th>
                <th className="px-5 py-3 font-medium">{t.width}</th>
                <th className="px-5 py-3 font-medium">{t.height}</th>
                <th className="px-5 py-3 font-medium">{t.absLong}</th>
                <th className="px-5 py-3 font-medium">{t.absShort}</th>
              </tr>
            </thead>
            <tbody>
              {rows === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                    {t.noCutYet} <span className="font-medium text-slate-700">{t.prepareCutListShort}</span> {t.toGetStarted}
                  </td>
                </tr>
              ) : (
                parts.map((p, i) => (
                  <tr key={`${label}-${i}`} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="px-5 py-3">{i + 1}</td>
                    <td className="px-5 py-3">{p.quantity}</td>
                    <td className="px-5 py-3">{p.width}</td>
                    <td className="px-5 py-3">{p.height}</td>
                    <td className="px-5 py-3">{p.abs_long}</td>
                    <td className="px-5 py-3">{p.abs_short}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Language switcher */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="sr-only">{t.language}</span>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  aria-pressed={lang === 'en'}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    lang === 'en'
                      ? 'bg-white shadow border border-slate-200 text-slate-900'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hr')}
                  aria-pressed={lang === 'hr'}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    lang === 'hr'
                      ? 'bg-white shadow border border-slate-200 text-slate-900'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  HR
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={openAdd}
              >
                {t.addElement}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setIsCutOpen(true)}
              >
                {t.prepareCutList}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8">
          {renderTable(uppers, t.upperElements)}
          {renderTable(lowers, t.lowerElements)}

          {/* Cut list with tabs */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center justify-between px-5 pt-4">
              <h2 className="text-base font-semibold text-slate-800">{t.cutList}</h2>
              <div className="text-xs font-medium text-slate-500">
                {['box', 'door', 'back'].includes(cutTab) ? (
                  <>
                    {cutTab === 'box' && itemsLabel(cutLists.box.length)}
                    {cutTab === 'door' && itemsLabel(cutLists.door.length)}
                    {cutTab === 'back' && itemsLabel(cutLists.back.length)}
                  </>
                ) : null}
              </div>
            </header>

            {/* Tabs */}
            <div className="px-5 pt-3">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setCutTab('box')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    cutTab === 'box'
                      ? 'bg-white shadow border border-slate-200 text-slate-900'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t.boxParts}
                </button>
                <button
                  type="button"
                  onClick={() => setCutTab('door')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    cutTab === 'door'
                      ? 'bg-white shadow border border-slate-200 text-slate-900'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t.doorParts}
                </button>
                <button
                  type="button"
                  onClick={() => setCutTab('back')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    cutTab === 'back'
                      ? 'bg-white shadow border border-slate-200 text-slate-900'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t.backParts}
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              {cutTab === 'box' && renderCutListTable(cutLists.box, t.boxParts)}
              {cutTab === 'door' && renderCutListTable(cutLists.door, t.doorParts)}
              {cutTab === 'back' && renderCutListTable(cutLists.back, t.backParts)}
            </div>
          </section>
        </div>
      </div>

      {/* Modal: Add/Edit Element */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onMouseDown={handleCancelAdd}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-lg scale-100 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-slate-800">
                {editingIndex === null ? t.addElementTitle : t.editElementTitle}
              </h3>
              <button
                ref={addCloseBtnRef}
                onClick={handleCancelAdd}
                className="-m-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 8.586 4.293 2.879A1 1 0 0 0 2.88 4.293L8.586 10l-5.707 5.707a1 1 0 0 0 1.414 1.414L10 11.414l5.707 5.707a1 1 0 0 0 1.414-1.414L11.414 10l5.707-5.707A1 1 0 0 0 15.707 2.88L10 8.586Z" clipRule="evenodd"/></svg>
              </button>
            </div>

            {/* Form */}
            <form className="mt-4 space-y-5" onSubmit={handleSaveElement}>
              {/* Type dropdown */}
              <div className="grid gap-2">
                <label htmlFor="elementType" className="text-sm font-medium text-slate-700">
                  {t.type}
                </label>
                <select
                  id="elementType"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value)}
                >
                  <option value="upper">{t.typeUpper}</option>
                  <option value="lower">{t.typeLower}</option>
                </select>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <label htmlFor="width" className="text-sm font-medium text-slate-700">{t.width}</label>
                  <input
                    id="width"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder={t.widthPh}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="height" className="text-sm font-medium text-slate-700">{t.height}</label>
                  <input
                    id="height"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={t.heightPh}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="depth" className="text-sm font-medium text-slate-700">{t.depth}</label>
                  <input
                    id="depth"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    placeholder={t.depthPh}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="doors" className="text-sm font-medium text-slate-700">{t.doors}</label>
                  <input
                    id="doors"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={doors}
                    onChange={(e) => setDoors(e.target.value)}
                    placeholder={t.doorsPh}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="shelves" className="text-sm font-medium text-slate-700">{t.shelves}</label>
                  <input
                    id="shelves"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={shelves}
                    onChange={(e) => setShelves(e.target.value)}
                    placeholder={t.shelvesPh}
                  />
                </div>
              </div>

              {/* Extra for Lower elements */}
              {elementType === 'lower' && (
                <>
                  <label htmlFor="gola" className="flex items-center gap-3 cursor-pointer select-none">
                    <span className="relative inline-flex h-6 w-11 items-center">
                      <input
                        id="gola"
                        type="checkbox"
                        className="peer sr-only"
                        checked={golaProfile}
                        onChange={(e) => setGolaProfile(e.target.checked)}
                      />
                      {/* Track */}
                      <span
                        className="absolute inset-0 rounded-full border border-slate-300 bg-slate-200 transition-colors duration-300 
                                  peer-checked:bg-indigo-600 peer-checked:border-indigo-600"
                      ></span>
                      {/* Thumb */}
                      <span
                        className="absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-300
                                  peer-checked:translate-x-5"
                      ></span>
                    </span>
                    <span className="text-sm font-medium text-slate-700">{t.golaProfile}</span>
                  </label>

                  {/* Door height visible only when Gola = true */}
                  {golaProfile && (
                    <div className="grid gap-2">
                      <label htmlFor="doorHeight" className="text-sm font-medium text-slate-700">
                        {t.doorHeight}
                      </label>
                      <input
                        id="doorHeight"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        value={doorHeight}
                        onChange={(e) => setDoorHeight(e.target.value)}
                        placeholder={t.doorHeightPh}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  onClick={handleCancelAdd}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {editingIndex === null ? t.save : t.update}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Prepare Cut List (decor inputs) */}
      {isCutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onMouseDown={handleCancelCut}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-lg scale-100 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-slate-800">{t.prepareCutListTitle}</h3>
              <button
                ref={cutCloseBtnRef}
                onClick={handleCancelCut}
                className="-m-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 8.586 4.293 2.879A1 1 0 0 0 2.88 4.293L8.586 10l-5.707 5.707a1 1 0 0 0 1.414 1.414L10 11.414l5.707 5.707a1 1 0 0 0 1.414-1.414L11.414 10l5.707-5.707A1 1 0 0 0 15.707 2.88L10 8.586Z" clipRule="evenodd"/></svg>
              </button>
            </div>

            <form className="mt-4 space-y-5" onSubmit={handlePrepareCutList}>
              <div className="grid gap-2">
                <label htmlFor="frontDecor" className="text-sm font-medium text-slate-700">{t.frontDecor}</label>
                <input
                  id="frontDecor"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={frontDecor}
                  onChange={(e) => setFrontDecor(e.target.value)}
                  placeholder={t.frontDecorPh}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="frontAbsDecor" className="text-sm font-medium text-slate-700">{t.frontAbsDecor}</label>
                <input
                  id="frontAbsDecor"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={frontAbsDecor}
                  onChange={(e) => setFrontAbsDecor(e.target.value)}
                  placeholder={t.frontAbsDecorPh}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="boxDecor" className="text-sm font-medium text-slate-700">{t.boxDecor}</label>
                <input
                  id="boxDecor"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={boxDecor}
                  onChange={(e) => setBoxDecor(e.target.value)}
                  placeholder={t.boxDecorPh}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="boxAbsDecor" className="text-sm font-medium text-slate-700">{t.boxAbsDecor}</label>
                <input
                  id="boxAbsDecor"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={boxAbsDecor}
                  onChange={(e) => setBoxAbsDecor(e.target.value)}
                  placeholder={t.boxAbsDecorPh}
                  required
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  onClick={handleCancelCut}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t.continue}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page padding bottom */}
      <div className="h-10" />
    </main>
  );
}
