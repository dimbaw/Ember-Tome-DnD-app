import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome, r as nextSessionNumber, t as SAMPLE_TRANSCRIPT } from "./store-Bo6EXT8E.mjs";
import { t as Button } from "./button-Db7VdWlM.mjs";
import { n as matchCharacter, r as nid } from "./ids-Dm96HNaF.mjs";
import { t as Textarea } from "./textarea-BBc36vrp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Square, c as Mic, r as Upload } from "../_libs/lucide-react.mjs";
import { a as Route$3 } from "./router-BmawLhnN.mjs";
import { a as makeScene, i as makePortrait, t as analyzeTranscript } from "./fns-D_-FsGjV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tome._campaignId.record-BjaCQa44.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function transcribeFile(file, keyterms) {
	const form = new FormData();
	form.append("file", file, file.name || "session.webm");
	for (const term of keyterms.slice(0, 40)) form.append("keyterm", term);
	const body = await (await fetch("/api/transcribe", {
		method: "POST",
		body: form
	})).json();
	if (!body.ok || !body.text) throw new Error(body.error || "Transcription failed");
	return body.text;
}
async function ingestSession(opts) {
	const state = useTome.getState();
	const campaign = state.campaigns.find((c) => c.id === opts.campaignId);
	if (!campaign) throw new Error("Campaign not found");
	const roster = state.characters.filter((c) => c.campaignId === opts.campaignId);
	opts.onStep("reading");
	const analyzed = await analyzeTranscript({ data: {
		transcript: opts.transcript,
		campaignName: campaign.name,
		world: campaign.world,
		existingCharacters: roster.map((c) => ({
			id: c.id,
			name: c.name,
			kind: c.kind,
			race: c.race,
			classOrRole: c.classOrRole,
			appearance: c.appearance
		}))
	} });
	if (!analyzed.ok) throw new Error(analyzed.error);
	const analysis = analyzed.analysis;
	const sessionId = nid("sess");
	const resolved = [];
	opts.onStep("portraits");
	for (const incoming of analysis.characters) {
		const existing = incoming.matchedExistingId && roster.find((c) => c.id === incoming.matchedExistingId) || matchCharacter(incoming.name, roster) || matchCharacter(incoming.name, resolved);
		if (existing) {
			const found = roster.find((c) => c.id === existing.id) ?? existing;
			if (incoming.whatHappened) useTome.getState().updateCharacter(found.id, {
				notes: found.notes ? `${found.notes}\n\n${incoming.whatHappened}` : incoming.whatHappened,
				status: incoming.status
			});
			resolved.push({
				...found,
				status: incoming.status
			});
			continue;
		}
		let portraitUrl = "";
		if (incoming.appearance) {
			opts.onStep("portraits", incoming.name);
			const made = await makePortrait({ data: { appearance: incoming.appearance } });
			if (made.ok) portraitUrl = made.url;
		}
		const character = {
			id: nid("char"),
			campaignId: opts.campaignId,
			name: incoming.name,
			kind: incoming.kind,
			race: incoming.race,
			classOrRole: incoming.classOrRole,
			appearance: incoming.appearance,
			portraitUrl,
			notes: incoming.whatHappened,
			status: incoming.status,
			firstSeenSessionId: sessionId
		};
		useTome.getState().addCharacter(character);
		roster.push(character);
		resolved.push(character);
	}
	const nameToId = (names) => names.map((n) => matchCharacter(n, resolved)?.id).filter((id) => Boolean(id));
	const events = analysis.events.filter((e) => e.text).map((e) => ({
		id: nid("ev"),
		text: e.text,
		characterIds: nameToId(e.characterNames)
	}));
	const scenes = [];
	for (const [index, s] of analysis.scenes.entries()) {
		opts.onStep("illustrating", s.title || `Scene ${index + 1}`);
		const involved = nameToId(s.characterNames).map((id) => resolved.find((c) => c.id === id)).filter((c) => Boolean(c));
		const refs = involved.filter((c) => c.portraitUrl).slice(0, 3).map((c) => c.portraitUrl);
		const appearances = involved.map((c) => `${c.name}: ${c.appearance}`);
		let imageUrl = "";
		const made = await makeScene({ data: {
			beat: s.beat || s.title,
			appearances,
			refs
		} });
		if (made.ok) imageUrl = made.url;
		if (!imageUrl) continue;
		scenes.push({
			id: nid("scene"),
			campaignId: opts.campaignId,
			sessionId,
			title: s.title,
			beat: s.beat,
			kind: s.kind,
			imageUrl,
			characterIds: involved.map((c) => c.id)
		});
	}
	opts.onStep("binding");
	const session = {
		id: sessionId,
		campaignId: opts.campaignId,
		number: nextSessionNumber(opts.campaignId),
		title: analysis.title,
		playedOn: analysis.playedOn || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		summary: analysis.summary,
		transcript: opts.transcript.slice(0, 2e4),
		events,
		characterIds: [...new Set(resolved.map((c) => c.id))],
		status: "complete",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	useTome.getState().addSession(session, scenes);
	useTome.getState().updateCampaign(opts.campaignId, { coverUrl: scenes[0]?.imageUrl || campaign.coverUrl });
	return {
		sessionId,
		campaignId: opts.campaignId
	};
}
var MAX_MS = 3e5;
var STEP_COPY = {
	listening: "Listening to the table…",
	reading: "Reading who was there, and what turned…",
	portraits: "Keeping the faces straight…",
	illustrating: "Painting the night…",
	binding: "Binding it into the tome…"
};
function RecordPage() {
	const { campaignId } = Route$3.useParams();
	const navigate = useNavigate();
	const characters = useTome((s) => s.characters).filter((c) => c.campaignId === campaignId);
	const [tab, setTab] = (0, import_react.useState)("record");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [blob, setBlob] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)("");
	const mediaRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const timerRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, []);
	function startTimer() {
		const started = Date.now();
		timerRef.current = window.setInterval(() => {
			const ms = Date.now() - started;
			setElapsed(ms);
			if (ms >= MAX_MS) stopRecording();
		}, 200);
	}
	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
			const recorder = new MediaRecorder(stream, {
				mimeType: mime,
				audioBitsPerSecond: 24e3
			});
			chunksRef.current = [];
			recorder.ondataavailable = (e) => {
				if (e.data.size) chunksRef.current.push(e.data);
			};
			recorder.onstop = () => {
				const file = new Blob(chunksRef.current, { type: recorder.mimeType });
				setBlob(file);
				stream.getTracks().forEach((t) => t.stop());
			};
			mediaRef.current = recorder;
			recorder.start();
			setRecording(true);
			setElapsed(0);
			setBlob(null);
			startTimer();
		} catch {
			toast.error("Microphone access was blocked. Upload a file or paste notes instead.");
			setTab("notes");
		}
	}
	function stopRecording() {
		if (timerRef.current) window.clearInterval(timerRef.current);
		mediaRef.current?.stop();
		setRecording(false);
	}
	async function run(transcript, file) {
		setBusy(true);
		try {
			let text = transcript?.trim() ?? "";
			const keyterms = characters.map((c) => c.name);
			if (!text && file) {
				setStep("listening");
				text = await transcribeFile(new File([file], "session.webm", { type: file.type || "audio/webm" }), keyterms);
			}
			if (!text) throw new Error("Nothing to chronicle yet.");
			const result = await ingestSession({
				campaignId,
				transcript: text,
				onStep: (s, d) => {
					setStep(s);
					setDetail(d ?? "");
				}
			});
			navigate({
				to: "/tome/$campaignId/session/$sessionId",
				params: {
					campaignId: result.campaignId,
					sessionId: result.sessionId
				}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not bind this session");
			setBusy(false);
			setStep(null);
		}
	}
	const seconds = Math.floor(elapsed / 1e3);
	const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-muted uppercase",
				children: "The table is listening"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Record a session"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "A few minutes of the table is enough — names, turning points, the fight that mattered. Faces already in this tome are reused so the story stays visually continuous."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]",
				children: [
					["record", "Record"],
					["upload", "Upload"],
					["notes", "Notes"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `h-11 flex-1 rounded-lg text-sm ${tab === id ? "bg-elevated text-fg" : "text-muted"}`,
					children: label
				}, id))
			}),
			busy && step ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: STEP_COPY[step]
					}),
					detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: detail
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-subtle",
						children: "This takes a little while. Portraits are painted once; scenes reuse them."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				tab === "record" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-col items-center rounded-xl bg-surface px-6 py-12 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: recording ? stopRecording : startRecording,
							className: "flex size-24 items-center justify-center rounded-full bg-primary text-primary-fg",
							"aria-label": recording ? "Stop recording" : "Start recording",
							children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 font-display text-3xl tabular-nums",
							children: clock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: "Up to five minutes. Speak the names clearly."
						}),
						blob && !recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6",
							onClick: () => run(void 0, blob),
							children: "Chronicle this recording"
						}) : null
					]
				}) : null,
				tab === "upload" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-10 flex cursor-pointer flex-col items-center rounded-xl bg-surface px-6 py-12 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-8 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Drop an audio clip, or choose a file."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: "webm, mp3, wav, m4a · keep it under a few minutes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "audio/*,.webm,.mp3,.wav,.m4a,.ogg",
							className: "sr-only",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (file) run(void 0, file);
							}
						})
					]
				}) : null,
				tab === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Who was there. What happened. The fight, the choice, the name they learned.",
						className: "min-h-56"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => run(notes),
							disabled: !notes.trim(),
							children: "Chronicle these notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setNotes(SAMPLE_TRANSCRIPT),
							type: "button",
							children: "Load a sample table"
						})]
					})]
				}) : null
			] })
		]
	});
}
//#endregion
export { RecordPage as component };
