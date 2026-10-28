import React, { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource } from "./ui";
import { MediaPicker } from "./MediaAdmin";

// Blog posts. The article body is written as plain text: blank lines separate paragraphs, a line starting
// with "## " is a sub-heading, and lines starting with "- " form a bullet list.

const bodyToText = (body) => body.map((b) => (typeof b === "string" ? b : b.h ? `## ${b.h}` : b.list.map((li) => `- ${li}`).join("\n"))).join("\n\n");

const textToBody = (text) =>
  text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n").map((l) => l.trim());
      if (lines.length === 1 && lines[0].startsWith("## ")) return { h: lines[0].slice(3).trim() };
      if (lines.every((l) => l.startsWith("- "))) return { list: lines.map((l) => l.slice(2).trim()) };
      return lines.join(" ");
    });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const BLANK = { slug: "", title: "", category: "", icon: "Newspaper", excerpt: "", cover: "", published: true, text: "" };

function Editor({ post, icons, onDone }) {
  const [f, setF] = useState(post ? { ...post, text: bodyToText(post.body) } : BLANK);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { text, id, created_at, updated_at, sort, ...rest } = f;
    const body = { ...rest, body: textToBody(text) };
    const ok = await act(() => (post ? api(`/admin/posts/${post.id}`, { method: "PUT", body }) : api("/admin/posts", { method: "POST", body })), post ? "Post saved" : "Post published");
    setBusy(false);
    if (ok) onDone();
  };

  return (
    <form onSubmit={save}>
      <PageTitle
        title={post ? "Edit post" : "New post"}
        actions={
          <>
            <Button variant="ghost" onClick={onDone}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </Button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <div className="space-y-4">
            <Field label="Title">
              <input
                required
                maxLength={160}
                value={f.title}
                onChange={(e) => setF({ ...f, title: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) })}
                className={`${INPUT} text-[16px]`}
              />
            </Field>
            <Field label="Short summary" hint="Shown on the blog page and in search results.">
              <textarea required rows={2} maxLength={400} value={f.excerpt} onChange={set("excerpt")} className={INPUT} />
            </Field>
            <Field label="Article" hint='Blank line = new paragraph. "## " starts a sub-heading. "- " lines make a bullet list.'>
              <textarea required rows={22} value={f.text} onChange={set("text")} className={`${INPUT} font-mono text-[13px] leading-6`} />
            </Field>
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Details">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[14px]">
                <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} className="h-4 w-4 accent-[#0047FF]" />
                Published (visible on the website)
              </label>
              <Field label="Web address" hint={`cube-software.com/blog/${f.slug || "..."}`}>
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  maxLength={80}
                  value={f.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setF({ ...f, slug: e.target.value });
                  }}
                  className={`${INPUT} font-mono`}
                />
              </Field>
              <Field label="Category">
                <input required maxLength={40} value={f.category} onChange={set("category")} className={INPUT} />
              </Field>
              <Field label="Icon" hint="Shown on the cover when there is no cover image.">
                <select value={f.icon} onChange={set("icon")} className={INPUT}>
                  {icons.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Card>
          <Card title="Cover image">
            {f.cover ? <img src={f.cover} alt="" className="aspect-video w-full rounded-lg object-cover" /> : <Empty>No cover image. The icon is used instead.</Empty>}
            <p className="mt-2 text-[12px] text-[#6B6E75]">Covers are wide (16:9): upload 1600 × 900 px or larger. Other shapes are cropped to fit.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="ghost" onClick={() => setPicking(true)}>
                Choose image
              </Button>
              {f.cover && (
                <Button variant="danger" onClick={() => setF({ ...f, cover: "" })}>
                  Remove
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(url) => {
            setF({ ...f, cover: url });
            setPicking(false);
          }}
        />
      )}
    </form>
  );
}

export default function BlogAdmin({ out }) {
  const [data, reload] = useResource("/admin/posts", out);
  const [editing, setEditing] = useState(null); // null, "new" or a post
  if (editing)
    return (
      <Editor
        post={editing === "new" ? null : editing}
        icons={data?.icons || ["Newspaper"]}
        onDone={() => {
          setEditing(null);
          reload();
        }}
      />
    );
  const toggle = async (p) =>
    (await act(() => api(`/admin/posts/${p.id}`, { method: "PUT", body: { ...p, published: !p.published } }), p.published ? "Hidden from the website" : "Published")) && reload();
  const remove = async (p) => window.confirm(`Delete "${p.title}"? This cannot be undone.`) && (await act(() => api(`/admin/posts/${p.id}`, { method: "DELETE" }), "Deleted")) && reload();
  return (
    <>
      <PageTitle
        title="Blog"
        desc="Posts appear on /blog in this order."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus size={16} /> New post
          </Button>
        }
      />
      <Card>
        {!data ? (
          <Empty>Loading...</Empty>
        ) : data.posts.length === 0 ? (
          <Empty>No posts yet.</Empty>
        ) : (
          <ul className="-my-2 divide-y divide-[#EEF1F7]">
            {data.posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-[#0A0626]">{p.title}</p>
                  <p className="text-[13px] text-[#6B6E75]">
                    {p.category} · /blog/{p.slug} {!p.published && <span className="ml-1 rounded bg-[#FFF4E5] px-1.5 py-0.5 text-[#9A5B00]">Hidden</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEditing(p)}>
                    <Pencil size={15} /> Edit
                  </Button>
                  <Button variant="ghost" onClick={() => toggle(p)} aria-label={p.published ? "Hide" : "Publish"}>
                    {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>
                  <Button variant="danger" onClick={() => remove(p)} aria-label={`Delete ${p.title}`}>
                    <Trash2 size={15} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
