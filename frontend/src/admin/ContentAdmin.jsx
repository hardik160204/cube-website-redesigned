import React, { useState } from "react";
import { LayoutGrid, PencilLine, Sparkles, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { isVideo } from "../lib/content";
import { EDIT_FLAG } from "../lib/editable";
import { Media } from "../components/MediaSlot";
import { Button, Card, Empty, INPUT, PageTitle, act, useResource, utcStamp } from "./ui";
import { MediaPicker } from "./MediaAdmin";

// Every change made with the visual editor — text, pictures, videos, animations and card lists — with the
// option to adjust or undo each one.

export function startEditing() {
  try {
    sessionStorage.setItem(EDIT_FLAG, "1");
  } catch {
    /* storage blocked */
  }
  window.location.assign("/");
}

const where = (scope) =>
  scope === "*" ? (
    "every page"
  ) : (
    <a href={scope} target="_blank" rel="noreferrer" className="text-primary hover:underline">
      {scope}
    </a>
  );

function Spot({ src, label }) {
  if (src.startsWith("slot:"))
    return (
      <span className="mt-1 flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-lg bg-[#0A0626] text-[11px] text-[#A9B3CC]">
        <Sparkles size={16} className="text-[#00B8FF]" /> Built-in animation
      </span>
    );
  return <Media src={src} alt={label} className="mt-1 h-20 rounded-lg bg-[#F5F8FD] object-contain" />;
}

function Row({ o, onChange }) {
  const [value, setValue] = useState(o.replacement);
  const [picking, setPicking] = useState(false);
  const save = async (replacement = value) => (await act(() => api("/admin/overrides", { method: "POST", body: { kind: o.kind, scope: o.scope, original: o.original, replacement, width: o.width, height: o.height } }), "Saved")) && onChange();
  const remove = async () => window.confirm("Undo this edit and show the original again?") && (await act(() => api(`/admin/overrides/${o.id}`, { method: "DELETE" }), "Original restored")) && onChange();
  const what = o.kind === "text" ? "Text" : o.original.startsWith("slot:") ? "Animation" : isVideo(o.original) ? "Video" : "Picture";
  return (
    <li className="grid gap-3 py-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
      <div className="min-w-0">
        <p className="text-[12px] text-[#6B6E75]">
          {what}
          {o.width ? ` (spot ${o.width} × ${o.height} px)` : ""} · {where(o.scope)} · {utcStamp(o.updated_at)}
        </p>
        {o.kind === "text" ? <p className="mt-1 line-clamp-3 text-[14px] text-[#6B6E75] line-through decoration-[#C9CED8]">{o.original}</p> : <Spot src={o.original} label="Original" />}
      </div>
      {o.kind === "text" ? (
        <textarea rows={3} maxLength={5000} value={value} onChange={(e) => setValue(e.target.value)} className={INPUT} aria-label="New text" />
      ) : (
        <div className="flex items-center gap-3">
          <Spot src={o.replacement} label="Replacement" />
          <Button variant="ghost" onClick={() => setPicking(true)}>
            Change
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        {o.kind === "text" && (
          <Button disabled={value === o.replacement || !value.trim()} onClick={() => save()}>
            Save
          </Button>
        )}
        <Button variant="danger" onClick={remove} aria-label="Undo this edit">
          <Trash2 size={15} />
        </Button>
      </div>
      {picking && (
        <MediaPicker
          imagesOnly={what === "Picture"}
          onClose={() => setPicking(false)}
          onPick={(url) => {
            setPicking(false);
            save(url);
          }}
        />
      )}
    </li>
  );
}

const LIST_LABEL = { features: "Feature cards", steps: "Steps", checklist: "List items", tiles: "Tiles", faq: "Questions", products: "Product cards" };
const firstText = (it) => (typeof it === "string" ? it : it.title || it.q || "");

export default function ContentAdmin({ out }) {
  const [data, reload] = useResource("/admin/overrides", out);
  const [lists, reloadLists] = useResource("/admin/lists", out);
  const undoList = async (l) => window.confirm("Undo these card changes and show the original cards again?") && (await act(() => api(`/admin/lists/${l.id}`, { method: "DELETE" }), "Original cards restored")) && reloadLists();
  return (
    <>
      <PageTitle
        title="Site content"
        desc="Change any text, picture, video or animation on the website, and add, remove or reorder cards. Open the editor, click what you want to change, and save."
        actions={
          <Button onClick={startEditing}>
            <PencilLine size={16} /> Edit the website
          </Button>
        }
      />
      <Card title="Card lists you changed" className="mb-6">
        {!lists ? (
          <Empty>Loading...</Empty>
        ) : lists.lists.length === 0 ? (
          <Empty>No card changes yet. In the editor, hover over any group of cards and click "Edit these cards".</Empty>
        ) : (
          <ul className="-my-3 divide-y divide-[#EEF1F7]">
            {lists.lists.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[14px]">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary">
                    <LayoutGrid size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-[#0A0626]">
                      {LIST_LABEL[l.key.split(":")[0]]} ({l.items.length}) · {where(l.scope)}
                    </span>
                    <span className="block truncate text-[12px] text-[#6B6E75]">
                      Starts with “{firstText(l.items[0])}” · {utcStamp(l.updated_at)}
                    </span>
                  </span>
                </span>
                <Button variant="danger" onClick={() => undoList(l)} aria-label="Undo these card changes">
                  <Trash2 size={15} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Text, pictures and animations you changed">
        {!data ? (
          <Empty>Loading...</Empty>
        ) : data.overrides.length === 0 ? (
          <Empty>No edits yet. Click "Edit the website" to make your first change.</Empty>
        ) : (
          <ul className="-my-4 divide-y divide-[#EEF1F7]">
            {data.overrides.map((o) => (
              <Row key={`${o.id}-${o.updated_at}`} o={o} onChange={reload} />
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
