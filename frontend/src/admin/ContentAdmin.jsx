import React, { useState } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { EDIT_FLAG } from "../components/SiteContent";
import { Button, Card, Empty, INPUT, PageTitle, act, useResource, utcStamp } from "./ui";
import { MediaPicker } from "./MediaAdmin";

// Every text and image change made with the visual editor, with the option to adjust or undo each one.

export function startEditing() {
  try {
    sessionStorage.setItem(EDIT_FLAG, "1");
  } catch {
    /* storage blocked */
  }
  window.location.assign("/");
}

function Row({ o, onChange }) {
  const [value, setValue] = useState(o.replacement);
  const [picking, setPicking] = useState(false);
  const save = async (replacement = value) => (await act(() => api("/admin/overrides", { method: "POST", body: { kind: o.kind, scope: o.scope, original: o.original, replacement, width: o.width, height: o.height } }), "Saved")) && onChange();
  const remove = async () => window.confirm("Undo this edit and show the original again?") && (await act(() => api(`/admin/overrides/${o.id}`, { method: "DELETE" }), "Original restored")) && onChange();
  return (
    <li className="grid gap-3 py-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
      <div className="min-w-0">
        <p className="text-[12px] text-[#6B6E75]">
          {o.kind === "text" ? "Text" : `Image${o.width ? ` (spot ${o.width} × ${o.height} px)` : ""}`} · {o.scope === "*" ? "every page" : <a href={o.scope} target="_blank" rel="noreferrer" className="text-primary hover:underline">{o.scope}</a>} · {utcStamp(o.updated_at)}
        </p>
        {o.kind === "text" ? (
          <p className="mt-1 line-clamp-3 text-[14px] text-[#6B6E75] line-through decoration-[#C9CED8]">{o.original}</p>
        ) : (
          <img src={o.original} alt="Original" className="mt-1 h-20 rounded-lg bg-[#F5F8FD] object-contain" />
        )}
      </div>
      {o.kind === "text" ? (
        <textarea rows={3} maxLength={5000} value={value} onChange={(e) => setValue(e.target.value)} className={INPUT} aria-label="New text" />
      ) : (
        <div className="flex items-center gap-3">
          <img src={o.replacement} alt="Replacement" className="h-20 rounded-lg bg-[#F5F8FD] object-contain" />
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

export default function ContentAdmin({ out }) {
  const [data, reload] = useResource("/admin/overrides", out);
  return (
    <>
      <PageTitle
        title="Site content"
        desc="Change any text or image on the website. Open the editor, click what you want to change, and save."
        actions={
          <Button onClick={startEditing}>
            <PencilLine size={16} /> Edit the website
          </Button>
        }
      />
      <Card title="Your edits">
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
