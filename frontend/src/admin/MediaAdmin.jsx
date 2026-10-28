import React, { useRef, useState } from "react";
import { Copy, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Button, Card, Empty, ImageSize, PageTitle, act, useResource } from "./ui";

// The image library: upload JPG, PNG, GIF or WebP and use them in posts and site edits. Photos larger than
// 2400 px on the longest side are scaled down in the browser first (as WebP), so pages stay fast; GIFs are
// sent as they are (scaling would drop their animation).
const MAX_SIDE = 2400;

async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || typeof createImageBitmap !== "function") return { file };
  const bmp = await createImageBitmap(file);
  const before = { w: bmp.width, h: bmp.height };
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bmp.close();
    return { file, before };
  }
  const canvas = Object.assign(document.createElement("canvas"), { width: Math.round(bmp.width * scale), height: Math.round(bmp.height * scale) });
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const blob = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.86));
  if (!blob || blob.size >= file.size) return { file, before };
  return { file: new File([blob], `${file.name.replace(/\.\w+$/, "")}.webp`, { type: "image/webp" }), before, after: { w: canvas.width, h: canvas.height } };
}

export function UploadButton({ onUploaded, label = "Upload image" }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return toast.error("That file is over 25 MB. Please pick a smaller image.");
    setBusy(true);
    const { file: ready, before, after } = await shrink(file).catch(() => ({ file }));
    if (ready.size > 5 * 1024 * 1024) {
      setBusy(false);
      return toast.error("Images must be 5 MB or smaller after resizing. GIFs can't be resized; please use a smaller one.");
    }
    const body = new FormData();
    body.append("file", ready);
    const r = await act(
      () => api("/admin/media", { method: "POST", body }),
      after ? `Uploaded. Resized from ${before.w} × ${before.h} to ${after.w} × ${after.h} px.` : `Uploaded${before ? ` (${before.w} × ${before.h} px)` : ""}.`
    );
    setBusy(false);
    if (r) onUploaded?.(r);
  };
  return (
    <>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={pick} className="hidden" />
      <Button onClick={() => input.current?.click()} disabled={busy}>
        <Upload size={16} /> {busy ? "Uploading..." : label}
      </Button>
    </>
  );
}

// A modal to choose an image from the library (or upload a new one).
export function MediaPicker({ onPick, onClose }) {
  const [data, reload] = useResource("/admin/media");
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A0626]/60 p-4" role="dialog" aria-modal="true" aria-label="Choose an image">
      <div className="flex max-h-[85vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-[#EEF1F7] px-5 py-4">
          <h2 className="text-[16px] font-medium text-[#0A0626]">Choose an image</h2>
          <div className="flex gap-2">
            <UploadButton onUploaded={(r) => (onPick(r.url), reload())} label="Upload new" />
            <Button variant="ghost" onClick={onClose} aria-label="Close">
              <X size={16} />
            </Button>
          </div>
        </header>
        <div className="overflow-y-auto p-5">
          {!data?.media?.length ? (
            <Empty>No images yet. Upload one to get started.</Empty>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data.media.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => onPick(m.url)} className="block w-full overflow-hidden rounded-xl border border-[#E5EAF4] transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.97]">
                    <img src={m.url} alt={m.original_name} loading="lazy" className="aspect-square w-full object-cover" />
                    <ImageSize src={m.url} className="block py-1 text-center text-[11px] text-[#6B6E75]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaAdmin({ out }) {
  const [data, reload] = useResource("/admin/media", out);
  const copy = (url) =>
    navigator.clipboard
      ?.writeText(window.location.origin + url)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Couldn't copy. Select the link instead."));
  const remove = async (m) =>
    window.confirm(`Delete ${m.original_name}? Pages or posts using it will show a broken image.`) && (await act(() => api(`/admin/media/${m.id}`, { method: "DELETE" }), "Deleted")) && reload();
  return (
    <>
      <PageTitle
        title="Images"
        desc="JPG, PNG, GIF or WebP. Big photos are scaled down to 2400 px automatically. For the right size for a spot, hover over it in Edit the website: it shows the spot's size, and the best upload is twice that."
        actions={<UploadButton onUploaded={reload} />}
      />
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : data.media.length === 0 ? (
          <Empty>No images uploaded yet.</Empty>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {data.media.map((m) => (
              <li key={m.id} className="overflow-hidden rounded-xl border border-[#E5EAF4] bg-white">
                <img src={m.url} alt={m.original_name} loading="lazy" className="aspect-[4/3] w-full bg-[#F5F8FD] object-cover" />
                <div className="p-3">
                  <p className="truncate text-[13px] font-medium text-[#0A0626]" title={m.original_name}>
                    {m.original_name}
                  </p>
                  <p className="text-[12px] text-[#6B6E75]">
                    <ImageSize src={m.url} /> · {Math.round(m.size / 1024)} KB
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="ghost" className="flex-1 px-2 py-1.5" onClick={() => copy(m.url)}>
                      <Copy size={14} /> Link
                    </Button>
                    <Button variant="danger" className="px-2 py-1.5" onClick={() => remove(m)} aria-label={`Delete ${m.original_name}`}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
