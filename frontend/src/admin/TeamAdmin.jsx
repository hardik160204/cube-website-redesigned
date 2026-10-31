import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { DEFAULT_SOCIALS, DEFAULT_TEAM, SOCIAL_KEYS } from "../lib/site";
import { Button, Card, Empty, Field, INPUT, PageTitle, act, useResource } from "./ui";
import { MediaPicker } from "./MediaAdmin";

// The leadership cards on Meet Our Team (name, role, photo, LinkedIn, bio) and the footer's social links.
// Starts from what the site shows today; saving replaces it.

const BLANK = { name: "", role: "", image: "", bio: "", linkedin: "" };

export default function TeamAdmin({ out }) {
  const [data, reload] = useResource("/admin/settings", out);
  const [team, setTeam] = useState(null);
  const [socials, setSocials] = useState(null);
  const [picking, setPicking] = useState(null); // index of the member choosing a photo

  useEffect(() => {
    if (!data) return;
    setTeam(data.team || DEFAULT_TEAM);
    setSocials({ ...DEFAULT_SOCIALS, ...(data.socials || {}) });
  }, [data]);

  if (!team) return <Empty>Loading...</Empty>;

  const update = (i, patch) => setTeam(team.map((m, k) => (k === i ? { ...m, ...patch } : m)));
  const move = (i, d) => {
    const next = [...team];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setTeam(next);
  };
  const saveTeam = async () => (await act(() => api("/admin/settings/team", { method: "PUT", body: { value: team } }), "Team saved. It's live on Meet Our Team.")) && reload();
  const saveSocials = async () => (await act(() => api("/admin/settings/socials", { method: "PUT", body: { value: socials } }), "Social links saved. They're live in the footer.")) && reload();

  return (
    <>
      <PageTitle
        title="Team & social links"
        desc="Leadership cards on the Meet Our Team page, and the social icons in the footer. Changes go live as soon as you save. Photos fill a portrait frame about 380 × 400 px: upload 800 × 840 px or larger, face near the top (the frame crops to fit)."
        actions={
          <a href="/meet-our-team" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-2 text-[14px] font-medium text-[#0A0626] hover:bg-[#F0F4FB]">
            View the team page ↗
          </a>
        }
      />

      <Card
        title={`Leadership (${team.length})`}
        actions={
          <>
            <Button variant="ghost" onClick={() => setTeam([...team, { ...BLANK }])} disabled={team.length >= 30}>
              <Plus size={15} /> Add person
            </Button>
            <Button onClick={saveTeam}>Save team</Button>
          </>
        }
      >
        <ul className="space-y-4">
          {team.map((m, i) => (
            <li key={i} className="grid gap-4 rounded-2xl border border-[#E5EAF4] p-4 md:grid-cols-[120px_1fr_auto]">
              <div>
                <button
                  type="button"
                  onClick={() => setPicking(i)}
                  className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-[#0A0626] text-white/70"
                  aria-label={`Choose a photo for ${m.name || "this person"}`}
                >
                  {m.image ? <img src={m.image} alt="" className="h-full w-full object-cover object-top" /> : <ImagePlus size={24} />}
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[11px] opacity-0 transition-opacity group-hover:opacity-100">Change photo</span>
                </button>
                {m.image && (
                  <button type="button" onClick={() => update(i, { image: "" })} className="mt-1.5 w-full text-center text-[12px] text-[#C81E1E] hover:underline">
                    Remove photo
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input value={m.name} maxLength={80} onChange={(e) => update(i, { name: e.target.value })} className={INPUT} />
                </Field>
                <Field label="Role">
                  <input value={m.role} maxLength={80} onChange={(e) => update(i, { role: e.target.value })} className={INPUT} />
                </Field>
                <Field label="LinkedIn profile" hint="Leave empty to show the badge without a link." className="sm:col-span-2">
                  <input type="url" placeholder="https://www.linkedin.com/in/..." value={m.linkedin} maxLength={300} onChange={(e) => update(i, { linkedin: e.target.value.trim() })} className={INPUT} />
                </Field>
                <Field label="Short bio (shown on hover)" className="sm:col-span-2">
                  <textarea rows={2} value={m.bio} maxLength={400} onChange={(e) => update(i, { bio: e.target.value })} className={INPUT} />
                </Field>
              </div>
              <div className="flex gap-2 md:flex-col">
                <Button variant="ghost" className="px-2" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp size={15} />
                </Button>
                <Button variant="ghost" className="px-2" disabled={i === team.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown size={15} />
                </Button>
                <Button variant="danger" className="px-2" onClick={() => window.confirm(`Remove ${m.name || "this person"}?`) && setTeam(team.filter((_, k) => k !== i))} aria-label={`Remove ${m.name || "this person"}`}>
                  <Trash2 size={15} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button onClick={saveTeam}>Save team</Button>
        </div>
      </Card>

      <Card title="Footer social links" className="mt-6" actions={<Button onClick={saveSocials}>Save links</Button>}>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_KEYS.map(([k, label]) => (
            <Field key={k} label={label} hint="Leave empty to hide this icon.">
              <input type="url" placeholder="https://..." value={socials[k]} maxLength={300} onChange={(e) => setSocials({ ...socials, [k]: e.target.value.trim() })} className={INPUT} />
            </Field>
          ))}
        </div>
      </Card>

      {picking !== null && (
        <MediaPicker
          imagesOnly
          onClose={() => setPicking(null)}
          onPick={(url) => {
            update(picking, { image: url });
            setPicking(null);
          }}
        />
      )}
    </>
  );
}
