import React, { useEffect, useRef, useState } from 'react';
import { reviewSections } from '../data/reviewSections';
import './Review.css';

type Decision = 'undecided' | 'keep' | 'simplify' | 'move' | 'remove';
type Status = 'todo' | 'ready' | 'done';
interface SectionDraft {
  decision: Decision;
  status: Status;
  notes: string;
  copy: string;
}
type Drafts = Record<string, SectionDraft>;
const emptyDraft: SectionDraft = { decision: 'undecided', status: 'todo', notes: '', copy: '' };
const storageKey = `portfolio-review:v1:${process.env.REACT_APP_REVIEW_WORKTREE || window.location.origin}`;

function readDrafts(): Drafts {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const drafts: Drafts = {};
    for (const section of reviewSections) {
      const draft = saved?.[section.id];
      if (draft && typeof draft.notes === 'string' && typeof draft.copy === 'string' &&
        ['undecided', 'keep', 'simplify', 'move', 'remove'].includes(draft.decision) &&
        ['todo', 'ready', 'done'].includes(draft.status)) {
        drafts[section.id] = draft;
      }
    }
    return drafts;
  } catch {
    return {};
  }
}

export default function Review() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [drafts, setDrafts] = useState<Drafts>(readDrafts);
  const [viewport, setViewport] = useState('desktop');
  const [previewVersion, setPreviewVersion] = useState(0);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState(false);
  const previewCanvas = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(600);
  const section = reviewSections[selectedIndex];
  const draft = drafts[section.id] || emptyDraft;
  const completed = reviewSections.filter(item => drafts[item.id]?.status === 'done').length;

  useEffect(() => {
    const canvas = previewCanvas.current;
    if (!canvas) return;
    const observer = new ResizeObserver(entries => setPreviewWidth(entries[0].contentRect.width));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(drafts));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [drafts]);

  function updateDraft(update: Partial<SectionDraft>) {
    setDrafts(previous => ({ ...previous, [section.id]: { ...(previous[section.id] || emptyDraft), ...update } }));
    setMessage('');
  }

  function exportText(onlyCurrent: boolean) {
    const selected = onlyCurrent ? [section] : reviewSections;
    return ['# Portfolio change brief', '', 'Apply the requested changes below. Confirm any missing personal facts before replacing them.', '',
      ...selected.flatMap(item => {
        const itemDraft = drafts[item.id] || emptyDraft;
        return [`## ${item.title}`, `Decision: ${itemDraft.decision} | Status: ${itemDraft.status}`,
          `Files: ${item.files.map(file => `frontend/src/${file}`).join(', ')}`, '',
          'Requested changes:', itemDraft.notes || '(No changes specified yet)', '',
          'Replacement copy:', itemDraft.copy || '(No replacement copy specified)', ''];
      })].join('\n');
  }

  async function copyCurrent() {
    try {
      await navigator.clipboard.writeText(exportText(true));
      setMessage('Section brief copied. Paste it into the Orca chat to apply these changes.');
    } catch {
      setMessage('Clipboard unavailable. Download the brief and attach or paste it into the chat.');
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([exportText(false)], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'portfolio-change-brief.md';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Change brief downloaded.');
  }

  return (
    <main className="review-workspace">
      <header className="review-header">
        <div><span className="review-eyebrow">LOCAL WORKSPACE</span><h1>Portfolio, one section at a time.</h1>
          <p>Decide what stays, write what changes, then review it beside your site.</p></div>
        <div className="review-header-actions"><a href="/" target="_blank" rel="noreferrer">Open portfolio ↗</a>
          <button onClick={downloadBrief}>Download all notes</button></div>
      </header>
      <div className="review-layout">
        <aside className="review-sidebar">
          <div className="review-progress"><strong>{completed} / {reviewSections.length} complete</strong>
            <progress value={completed} max={reviewSections.length} aria-label="Review progress" /></div>
          <nav aria-label="Review sections">{reviewSections.map((item, index) => (
            <React.Fragment key={item.id}>
              {(index === 0 || reviewSections[index - 1].group !== item.group) && <h2>{item.group}</h2>}
              <button className={index === selectedIndex ? 'is-selected' : ''} aria-current={index === selectedIndex ? 'step' : undefined}
                onClick={() => { setSelectedIndex(index); setMessage(''); }}>
                <span className="review-step-number">{drafts[item.id]?.status === 'done' ? '✓' : index + 1}</span>
                <span>{item.title}<small>{drafts[item.id]?.status === 'ready' ? 'Ready to apply' : drafts[item.id]?.status === 'done' ? 'Complete' : 'To review'}</small></span>
              </button>
            </React.Fragment>
          ))}</nav>
          <p className="review-save-status" role="status">{saveError ? 'Browser saving is unavailable. Download your notes before leaving.' : 'Notes save in this browser for this worktree.'}</p>
        </aside>
        <section className="review-editor" aria-labelledby="review-section-title">
          <span className="review-eyebrow">SECTION {selectedIndex + 1} OF {reviewSections.length}</span>
          <h2 id="review-section-title">{section.title}</h2>
          <div className="review-summary"><h3>What you have</h3><p>{section.current}</p></div>
          <div className="review-suggestion"><h3>A cleaner direction</h3><p>{section.suggestion}</p></div>
          <div className="review-prompts"><h3>Decisions to make</h3><ul>{section.questions.map(question => <li key={question}>{question}</li>)}</ul></div>
          <fieldset className="review-decisions"><legend>What should happen to this section?</legend>
            {(['undecided', 'keep', 'simplify', 'move', 'remove'] as Decision[]).map(decision => (
              <label key={decision}><input type="radio" name="decision" checked={draft.decision === decision} onChange={() => updateDraft({ decision })} />
                {decision === 'undecided' ? 'Decide later' : decision.charAt(0).toUpperCase() + decision.slice(1)}</label>
            ))}</fieldset>
          <label className="review-field" htmlFor="review-notes">Changes you want
            <textarea id="review-notes" rows={4} value={draft.notes} onChange={event => updateDraft({ notes: event.target.value })}
              placeholder="What should change? Include layout preferences, corrections, and anything to keep." /></label>
          <label className="review-field" htmlFor="review-copy">Replacement wording <span>(optional)</span>
            <textarea id="review-copy" rows={4} value={draft.copy} onChange={event => updateDraft({ copy: event.target.value })}
              placeholder="Write your updated bio, role details, project description, or other copy here." /></label>
          <label className="review-field" htmlFor="review-status">Progress
            <select id="review-status" value={draft.status} onChange={event => updateDraft({ status: event.target.value as Status })}>
              <option value="todo">To review</option><option value="ready">Ready to apply</option><option value="done">Applied & reviewed</option>
            </select></label>
          <p className="review-help">These are draft instructions. Copy a section brief into this chat for me to edit the source; the preview shows the current site and updates when its code changes.</p>
          <div className="review-editor-actions"><button className="review-primary" onClick={copyCurrent}>Copy section brief</button>
            <button onClick={() => setSelectedIndex(previous => Math.max(0, previous - 1))} disabled={selectedIndex === 0}>Previous</button>
            <button onClick={() => setSelectedIndex(previous => Math.min(reviewSections.length - 1, previous + 1))} disabled={selectedIndex === reviewSections.length - 1}>Next section →</button></div>
          <p className="review-message" role="status">{message}</p>
          <details className="review-files"><summary>Source files for this section</summary>{section.files.map(file => <code key={file}>frontend/src/{file}</code>)}</details>
        </section>
        <section className="review-preview" aria-label="Live portfolio preview">
          <div className="review-preview-toolbar"><strong>Live preview</strong>
            <div><button aria-pressed={viewport === 'desktop'} onClick={() => setViewport('desktop')}>Desktop</button>
              <button aria-pressed={viewport === 'mobile'} onClick={() => setViewport('mobile')}>Mobile</button>
              <button aria-label="Reload preview" onClick={() => setPreviewVersion(previous => previous + 1)}>↻</button></div></div>
          <div ref={previewCanvas} className={`review-preview-canvas ${viewport}`}
            style={{ '--review-preview-scale': Math.min(previewWidth / 1200, 1) } as React.CSSProperties}>
            <iframe key={`${section.route}:${viewport}:${previewVersion}`} title={`${section.title} portfolio preview`}
              src={`${section.route}?preview=1`} style={{ width: viewport === 'mobile' ? '390px' : '1200px' }} />
          </div>
          <p>Start with structure, then update facts, projects, and the finishing touches.</p>
        </section>
      </div>
    </main>
  );
}
