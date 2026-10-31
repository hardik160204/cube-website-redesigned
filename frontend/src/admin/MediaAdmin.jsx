import React, { useRef, useState } from "react";
import { Copy, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Button, Card, Empty, ImageSize, PageTitle, act, useResource } from "./ui";

// The media library: pictures, GIFs and short videos for pages, posts, cards and animations. Files go
// straight from the browser to Storage through a one-file upload link the server signs (no key in the
// browser, and big videos don't pass through the server); the server then checks each file really is what
// it says. JPG and PNG photos larger than 2400 px are scaled down in the browser first; GIF and WebP are
// sent as they are, so animations keep moving.
const MAX_SIDE = 2400;
export const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm";
const LIMIT_MB = { "video/mp4": 50, "video/webm": 50 }; // pictures: 10 MB
export const ACCEPT_NOTE =
  "Pictures: JPG, PNG, WebP or AVIF, up to 10 MB (big photos are scaled down to 2400 px). Animations: GIF or animated WebP up to 10 MB, or MP4 / WebM video up to 50 MB — videos play muted, on a loop. Not accepted: SVG, HEIC, MOV and other files (convert them first).";

const isVideoFile = (m) => String(m.mime || "").startsWith("video/");

async function shrink(file) {
  if (!/^image\/(jpeg|png)$/.test(file.type) || typeof createImageBitmap !== "function") return { file };
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

// PUT the file to its signed upload link, reporting progress (big videos take a while).
function put(url, file, mime, onProgress) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("PUT", url);
    x.setRequestHeader("Content-Type", mime);
    x.setRequestHeader("x-upsert", "false");
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    x.onload = () => (x.status < 300 ? resolve() : reject(new Error("Storage refused the file. Check its type and size, then try again.")));
    x.onerror = () => reject(new Error("The upload failed. Check your connection and try again."));
    x.send(file);
  });
}

// Upload one file; resolves to { id, url, mime }. Throws with a message to show.
export async function uploadFile(file, onProgress = () => {}) {
  if (!ACCEPT.split(",").includes(file.type)) throw new Error(`"${file.name}" can't be used. ${ACCEPT_NOTE}`);
  const limit = LIMIT_MB[file.type] || 10;
  if (file.size > (file.type.startsWith("video/") ? limit : 25) * 1024 * 1024) throw new Error(`That file is over ${file.type.startsWith("video/") ? limit : 25} MB. Please use a smaller one.`);
  const { file: ready, before, after } = await shrink(file).catch(() => ({ file }));
  if (ready.size > limit * 1024 * 1024) throw new Error(`Pictures and GIFs must be ${limit} MB or smaller (after resizing).`);
  const signed = await api("/admin/media/sign", { method: "POST", body: { type: ready.type, size: ready.size } });
  await put(signed.uploadUrl, ready, signed.mime, onProgress);
  const done = await api("/admin/media/confirm", { method: "POST", body: { file: signed.file, name: file.name } });
  return { ...done, before, after };
}

export function UploadButton({ onUploaded, label = "Upload file" }) {
  const input = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle, else percent
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProgress(0);
    try {
      const r = await uploadFile(file, setProgress);
      toast.success(r.after ? `Uploaded. Resized from ${r.before.w} × ${r.before.h} to ${r.after.w} × ${r.after.h} px.` : `Uploaded${r.before ? ` (${r.before.w} × ${r.before.h} px)` : ""}.`);
      onUploaded?.(r);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProgress(null);
    }
  };
  return (
    <>
      <input ref={input} type="file" accept={ACCEPT} onChange={pick} className="hidden" />
      <Button onClick={() => input.current?.click()} disabled={progress !== null}>
        <Upload size={16} /> {progress === null ? label : `Uploading... ${progress}%`}
      </Button>
    </>
  );
}

// A small preview of a library file: the picture itself, or the video's first frame.
function Thumb({ m, className }) {
  return isVideoFile(m) ? <video src={m.url} muted playsInline preload="metadata" aria-label={m.original_name} className={className} /> : <img src={m.url} alt={m.original_name} loading="lazy" className={className} />;
}

// A modal to choose a file from the library (or upload a new one). It sits above every other editor box.
// imagesOnly: for spots that can only show a picture (photos, covers, card pictures).
export function MediaPicker({ onPick, onClose, imagesOnly = false, title = imagesOnly ? "Choose a picture or GIF" : "Choose a picture, GIF or video" }) {
  const [all, reload] = useResource("/admin/media");
  const data = all && { media: all.media.filter((m) => !imagesOnly || !isVideoFile(m)) };
  const picked = (r) => (imagesOnly && isVideoFile(r) ? toast.error("This spot can only show a picture or GIF, not a video.") : onPick(r.url));
  return (
    <div data-cube-ui="" className="fixed inset-0 z-[10010] flex items-center justify-center bg-[#0A0626]/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex max-h-[85vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-white text-[#0A0626]">
        <header className="flex items-center justify-between gap-3 border-b border-[#EEF1F7] px-5 py-4">
          <h2 className="text-[16px] font-medium">{title}</h2>
          <div className="flex gap-2">
            <UploadButton onUploaded={(r) => (picked(r), reload())} label="Upload new" />
            <Button variant="ghost" onClick={onClose} aria-label="Close">
              <X size={16} />
            </Button>
          </div>
        </header>
        <p className="border-b border-[#EEF1F7] bg-[#F5F8FD] px-5 py-2.5 text-[12px] leading-5 text-[#404348]">{ACCEPT_NOTE}</p>
        <div className="overflow-y-auto p-5">
          {!data?.media?.length ? (
            <Empty>Nothing uploaded yet. Upload a file to get started.</Empty>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data.media.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => onPick(m.url)} className="block w-full overflow-hidden rounded-xl border border-[#E5EAF4] transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.97]">
                    <Thumb m={m} className="aspect-square w-full bg-[#F5F8FD] object-cover" />
                    <span className="block truncate px-1 py-1 text-center text-[11px] text-[#6B6E75]">{isVideoFile(m) ? "Video" : <ImageSize src={m.url} />}</span>
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
      ?.writeText(url)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Couldn't copy. Select the link instead."));
  const remove = async (m) =>
    window.confirm(`Delete ${m.original_name}? Pages, cards or posts using it will show a broken picture.`) && (await act(() => api(`/admin/media/${m.id}`, { method: "DELETE" }), "Deleted")) && reload();
  return (
    <>
      <PageTitle
        title="Images & videos"
        desc="Everything uploaded for the website. For the right size for a spot, hover over it in Edit the website: it shows the spot's size, and the best upload is twice that."
        actions={<UploadButton onUploaded={reload} />}
      />
      <p className="-mt-3 mb-5 rounded-xl border border-[#E5EAF4] bg-white p-3 text-[13px] leading-5 text-[#404348]">{ACCEPT_NOTE}</p>
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : data.media.length === 0 ? (
          <Empty>Nothing uploaded yet.</Empty>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {data.media.map((m) => (
              <li key={m.id} className="overflow-hidden rounded-xl border border-[#E5EAF4] bg-white">
                <Thumb m={m} className="aspect-[4/3] w-full bg-[#F5F8FD] object-cover" />
                <div className="p-3">
                  <p className="truncate text-[13px] font-medium text-[#0A0626]" title={m.original_name}>
                    {m.original_name}
                  </p>
                  <p className="text-[12px] text-[#6B6E75]">
                    {isVideoFile(m) ? "Video" : <ImageSize src={m.url} />} · {m.size >= 1048576 ? `${(m.size / 1048576).toFixed(1)} MB` : `${Math.round(m.size / 1024)} KB`}
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
