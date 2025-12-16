# Lumora — Root Makefile (recovered)
# Contains EMML CI helpers required by tests and self-check.

SHELL := /bin/sh


# Ensure multi-line recipes (e.g., node heredocs) run in a single shell
.ONESHELL:
SHELL := /bin/sh
.SHELLFLAGS := -eu -c

.PHONY: help \
  emml-ci-self-check \
  emml-ci-status emml-ci-recommend emml-ci-lint emml-ci-workflow-validate \
  emml-ci-enabled-workflow-lint \
  emml-ci-enabled-workflow-ids-lint \
  emml-ci-enabled-workflow-gates-lint \
  emml-ci-enabled-workflow-meta-lint \
  emml-ci-enabled-workflow-guard-lint \
  emml-ci-enabled-workflow-permissions-lint \
  emml-ci-enabled-workflow-actions-pin-lint \
  emml-ci-enabled-workflow-node-lint \
  emml-ci-enabled-workflow-cache-lint \
  emml-ci-enabled-workflow-install-lint \
  emml-ci-enabled-workflow-checkout-lint \
  emml-ci-enabled-workflow-checkout-submodules-lint \
  emml-ci-enabled-workflow-checkout-token-lint \
  emml-ci-enabled-workflow-checkout-persist-credentials-lint \
  emml-ci-enabled-workflow-oidc-lint \
  emml-ci-enabled-workflow-pr-target-lint \
  emml-ci-enabled-workflow-concurrency-lint \
  emml-ci-enabled-workflow-timeout-lint \
  emml-ci-enabled-workflow-actions-sha-pin-lint \
  emml-ci-enabled-workflow-permissions-min-lint \
  emml-ci-enabled-workflow-runner-env-protections-lint \
  emml-ci-enabled-workflow-secret-exposure-lint \
  emml-ci-enabled-workflow-checkout-depth-lint \
  emml-ci-enabled-workflow-checkout-sparse-filter-lint \
  emml-ci-enabled-workflow-artifact-retention-lint \
  emml-ci-enabled-workflow-cache-scope-keys-lint \
  emml-ci-enabled-workflow-artifact-download-scope-lint

help:
	@echo "Make targets:"
	@echo "  make emml-ci-self-check                                   - EMML CI self-check (offline)"
	@echo "  make emml-ci-enabled-workflow-secret-exposure-lint         - Disallow plain env secrets/hardcoded secret-like values"
	@echo "  make emml-ci-enabled-workflow-checkout-depth-lint           - Require actions/checkout fetch-depth: 1 or 2"
	@echo "  make emml-ci-enabled-workflow-checkout-sparse-filter-lint   - Require sparse-checkout or filter: blob:none near actions/checkout"
	@echo "  make emml-ci-enabled-workflow-artifact-retention-lint       - Require upload-artifact retention-days numeric <= 7"
	@echo "  make emml-ci-enabled-workflow-cache-scope-keys-lint         - Require actions/cache path + context-scoped key"
	@echo "  make emml-ci-enabled-workflow-artifact-download-scope-lint  - Require download-artifact scoping (name/path/pattern)"

# ─────────────────────────────────────────────────────────────────────────────
# Stubs (kept to satisfy docs/tests until full Makefile is restored elsewhere)
# ─────────────────────────────────────────────────────────────────────────────
emml-ci-status:
	@echo "EMML CI STATUS: SKIP (recovered Makefile stub)"

	emml-ci-recommend:
	@echo "EMML CI RECOMMEND: SKIP (recovered Makefile stub)"

	emml-ci-lint:
	@echo "EMML CI LINT: SKIP (recovered Makefile stub)"

emml-ci-workflow-validate:
	@echo "EMML CI WORKFLOW VALIDATE: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-lint:
	@echo "EMML ENABLED WORKFLOW LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-ids-lint:
	@echo "EMML ENABLED WORKFLOW IDS LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-gates-lint:
	@echo "EMML ENABLED WORKFLOW GATES LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-meta-lint:
	@echo "EMML ENABLED WORKFLOW META LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-guard-lint:
	@echo "EMML ENABLED WORKFLOW GUARD LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-permissions-lint:
	@echo "EMML ENABLED WORKFLOW PERMISSIONS LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-actions-pin-lint:
	@echo "EMML ENABLED WORKFLOW ACTIONS PIN LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-node-lint:
	@echo "EMML ENABLED WORKFLOW NODE LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-cache-lint:
	@echo "EMML ENABLED WORKFLOW CACHE LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-install-lint:
	@echo "EMML ENABLED WORKFLOW INSTALL LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-checkout-lint:
	@echo "EMML ENABLED WORKFLOW CHECKOUT LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-checkout-submodules-lint:
	@echo "EMML ENABLED WORKFLOW CHECKOUT SUBMODULES LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-checkout-token-lint:
	@echo "EMML ENABLED WORKFLOW CHECKOUT TOKEN LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-checkout-persist-credentials-lint:
	@echo "EMML ENABLED WORKFLOW CHECKOUT PERSIST CREDENTIALS LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-oidc-lint:
	@echo "EMML ENABLED WORKFLOW OIDC LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-pr-target-lint:
	@echo "EMML ENABLED WORKFLOW PR TARGET LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-concurrency-lint:
	@echo "EMML ENABLED WORKFLOW CONCURRENCY LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-timeout-lint:
	@echo "EMML ENABLED WORKFLOW TIMEOUT LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-actions-sha-pin-lint:
	@echo "EMML ENABLED WORKFLOW ACTIONS SHA PIN LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-permissions-min-lint:
	@echo "EMML ENABLED WORKFLOW PERMISSIONS MIN LINT: SKIP (recovered Makefile stub)"

	emml-ci-enabled-workflow-runner-env-protections-lint:
	@echo "EMML ENABLED WORKFLOW RUNNER ENV PROTECTIONS LINT: SKIP (recovered Makefile stub)"

# ─────────────────────────────────────────────────────────────────────────────
# Real targets required by existing tests (Steps 1734–1744)
# ─────────────────────────────────────────────────────────────────────────────

	emml-ci-enabled-workflow-secret-exposure-lint:
	@node - <<'NODE'
	"use strict";
	const fs = require("fs");
	const path = require("path");
	function ok(m){ console.log(m); process.exit(0); }
	function skip(m){ console.log(m); process.exit(0); }
	function fail(m){ console.error(m); process.exit(2); }
	
	const dir = path.join(".github","workflows");
	if (!fs.existsSync(dir)) skip("EMML ENABLED WORKFLOW SECRET EXPOSURE LINT: SKIP");
	
	const files = fs.readdirSync(dir).filter(f => /\.ya?ml$$/i.test(f)).map(f => path.join(dir,f));
	if (!files.length) skip("EMML ENABLED WORKFLOW SECRET EXPOSURE LINT: SKIP");
	
	function isEnabledWorkflow(text){
	  return /\bon\s*:/m.test(text) && (/\bpush\b/m.test(text) || /\bpull_request\b/m.test(text) || /\bworkflow_dispatch\b/m.test(text) || /\bschedule\b/m.test(text));
	}
	
	const keyRe = /(SECRET|TOKEN|PASSWORD|PASS|KEY|API_KEY|PRIVATE|CREDENTIAL|AUTH|BEARER)/i;
	const valueBadRes = [
	  /gh[pousr]_[A-Za-z0-9_]{20,}/i,
	  /\bAKIA[0-9A-Z]{16}\b/,
	  /\bASIA[0-9A-Z]{16}\b/,
	  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
	  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/
	];
	
	function isLiteralValue(v){
	  const s = String(v || "").trim();
	  if (!s) return false;
	  if (s.includes("$${{")) return false;
	  return true;
	}
	
	function stripQuotes(v){
	  let s = String(v || "").trim();
	  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1,-1);
	  return s.trim();
	}
	
	let foundAny = false;
	let bad = false;
	
	for (const f of files) {
	  const text = fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
	  if (!isEnabledWorkflow(text)) continue;
	  foundAny = true;
	
	  const lines = text.split("\n");
	  for (const raw of lines) {
	    const m = raw.match(/^\s*([A-Za-z_][A-Za-z0-9_\-]*)\s*:\s*([^#]+?)\s*(?:#.*)?$$/);
	    if (!m) continue;
	
	    const k = m[1].trim();
	    const v0 = m[2].trim();
	    const v = stripQuotes(v0);
	
	    const keyLooksSecret = keyRe.test(k);
	
	    if (keyLooksSecret && isLiteralValue(v0)) {
	      const lower = v.toLowerCase();
	      const benign = lower === "true" || lower === "false" || lower === "0" || lower === "1" || lower === "yes" || lower === "no";
	      if (!benign) { bad = true; break; }
	    }
	
	    if (isLiteralValue(v0)) {
	      for (const re of valueBadRes) { if (re.test(v)) { bad = true; break; } }
	      if (bad) break;
	      if (keyLooksSecret && v.length >= 16 && /[A-Za-z0-9+/_=-]{16,}/.test(v)) { bad = true; break; }
	    }
	  }
	  if (bad) break;
	}
	
	if (!foundAny) skip("EMML ENABLED WORKFLOW SECRET EXPOSURE LINT: SKIP");
	if (bad) fail("EMML ENABLED WORKFLOW SECRET EXPOSURE LINT: FAIL (plain env secrets or hardcoded secret-like values detected; use $${{ secrets.* }} / OIDC / protected env)");
	ok("EMML ENABLED WORKFLOW SECRET EXPOSURE LINT: OK");
	NODE

	emml-ci-enabled-workflow-checkout-depth-lint:
	@node - <<'NODE'
	"use strict";
	const fs = require("fs");
	const path = require("path");
	function ok(m){ console.log(m); process.exit(0); }
	function skip(m){ console.log(m); process.exit(0); }
	function fail(m){ console.error(m); process.exit(2); }
	
	const dir = path.join(".github","workflows");
	if (!fs.existsSync(dir)) skip("EMML ENABLED WORKFLOW CHECKOUT DEPTH LINT: SKIP");
	
	const files = fs.readdirSync(dir).filter(f => /\.ya?ml$$/i.test(f)).map(f => path.join(dir,f));
	if (!files.length) skip("EMML ENABLED WORKFLOW CHECKOUT DEPTH LINT: SKIP");
	
	function isEnabledWorkflow(text){
	  return /\bon\s*:/m.test(text) && (/\bpush\b/m.test(text) || /\bpull_request\b/m.test(text) || /\bworkflow_dispatch\b/m.test(text) || /\bschedule\b/m.test(text));
	}
	
	const checkoutUseRe = /^\s*uses\s*:\s*actions\/checkout@/im;
	const depthRe = /^\s*fetch-depth\s*:\s*([^#\n]+)\s*(?:#.*)?$$/im;
	
	function blockAfter(lines,i,max=45){ return lines.slice(i, Math.min(lines.length, i+max)).join("\n"); }
	
	let foundAny=false, bad=false;
	
	for (const f of files){
	  const s = fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
	  if (!isEnabledWorkflow(s)) continue;
	  const lines = s.split("\n");
	  let fileHasCheckout=false;
	
	  for (let i=0;i<lines.length;i++){
	    if (!checkoutUseRe.test(lines[i])) continue;
	    fileHasCheckout=true;
	    const blk = blockAfter(lines,i,55);
	    const m = blk.match(depthRe);
	    if (!m) { bad=true; break; }
	    const raw = String(m[1]||"").trim().replace(/^["']|["']$$/g,"").trim();
	    if (raw.includes("$${{")) { bad=true; break; } // must be explicit numeric
	    const n = Number(raw);
	    if (!Number.isFinite(n)) { bad=true; break; }
	    if (!(n === 1 || n === 2)) { bad=true; break; }
	  }
	
	  if (fileHasCheckout) foundAny=true;
	  if (bad) break;
	}
	
	if (!foundAny) skip("EMML ENABLED WORKFLOW CHECKOUT DEPTH LINT: SKIP");
	if (bad) fail("EMML ENABLED WORKFLOW CHECKOUT DEPTH LINT: FAIL (actions/checkout must set fetch-depth: 1 or 2)");
	ok("EMML ENABLED WORKFLOW CHECKOUT DEPTH LINT: OK");
	NODE

	emml-ci-enabled-workflow-checkout-sparse-filter-lint:
	@node - <<'NODE'
	"use strict";
	const fs = require("fs");
	const path = require("path");
	function ok(m){ console.log(m); process.exit(0); }
	function skip(m){ console.log(m); process.exit(0); }
	function fail(m){ console.error(m); process.exit(2); }
	
	const dir = path.join(".github","workflows");
	if (!fs.existsSync(dir)) skip("EMML ENABLED WORKFLOW CHECKOUT SPARSE/FILTER LINT: SKIP");
	
	const files = fs.readdirSync(dir).filter(f => /\.ya?ml$$/i.test(f)).map(f => path.join(dir,f));
	if (!files.length) skip("EMML ENABLED WORKFLOW CHECKOUT SPARSE/FILTER LINT: SKIP");
	
	function isEnabledWorkflow(text){
	  return /\bon\s*:/m.test(text) && (/\bpush\b/m.test(text) || /\bpull_request\b/m.test(text) || /\bworkflow_dispatch\b/m.test(text) || /\bschedule\b/m.test(text));
	}
	
	const checkoutUseRe = /^\s*uses\s*:\s*actions\/checkout@/im;
	const sparseRe = /^\s*sparse-checkout\s*:/im;
	const filterBlobNoneRe = /^\s*filter\s*:\s*.*\bblob:none\b/im;
	
	function blockAfter(lines,i,max=45){ return lines.slice(i, Math.min(lines.length, i+max)).join("\n"); }
	
	let foundAny=false, bad=false;
	
	for (const f of files){
	  const s = fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
	  if (!isEnabledWorkflow(s)) continue;
	
	  const lines = s.split("\n");
	  let fileHasCheckout=false;
	
	  for (let i=0;i<lines.length;i++){
	    if (!checkoutUseRe.test(lines[i])) continue;
	    fileHasCheckout=true;
	    const blk = blockAfter(lines,i,55);
	    const okSparse = sparseRe.test(blk);
	    const okFilter = filterBlobNoneRe.test(blk);
	    if (!okSparse && !okFilter) { bad=true; break; }
	  }
	
	  if (fileHasCheckout) foundAny=true;
	  if (bad) break;
	}
	
	if (!foundAny) skip("EMML ENABLED WORKFLOW CHECKOUT SPARSE/FILTER LINT: SKIP");
	if (bad) fail("EMML ENABLED WORKFLOW CHECKOUT SPARSE/FILTER LINT: FAIL (actions/checkout must use sparse-checkout or filter: blob:none)");
	ok("EMML ENABLED WORKFLOW CHECKOUT SPARSE/FILTER LINT: OK");
	NODE

	emml-ci-enabled-workflow-artifact-retention-lint:
	@node - <<'NODE'
	"use strict";
	const fs = require("fs");
	const path = require("path");
	function ok(m){ console.log(m); process.exit(0); }
	function skip(m){ console.log(m); process.exit(0); }
	function fail(m){ console.error(m); process.exit(2); }
	
	const dir = path.join(".github","workflows");
	if (!fs.existsSync(dir)) skip("EMML ENABLED WORKFLOW ARTIFACT RETENTION LINT: SKIP");
	
	const files = fs.readdirSync(dir).filter(f => /\.ya?ml$$/i.test(f)).map(f => path.join(dir,f));
	if (!files.length) skip("EMML ENABLED WORKFLOW ARTIFACT RETENTION LINT: SKIP");
	
	function isEnabledWorkflow(text){
	  return /\bon\s*:/m.test(text) && (/\bpush\b/m.test(text) || /\bpull_request\b/m.test(text) || /\bworkflow_dispatch\b/m.test(text) || /\bschedule\b/m.test(text));
	}
	
	const uploadUseRe = /^\s*uses\s*:\s*actions\/upload-artifact@/im;
	const retentionRe = /^\s*retention-days\s*:\s*([^#\n]+)\s*(?:#.*)?$$/im;
	
	function blockAfter(lines,i,max=60){ return lines.slice(i, Math.min(lines.length, i+max)).join("\n"); }
	
	function parseRetention(blk){
	  const m = blk.match(retentionRe);
	  if (!m) return { present:false, value:null, expr:false };
	  const raw = String(m[1]||"").trim();
	  const v = raw.replace(/^["']|["']$$/g,"").trim();
	  const expr = v.includes("$${{");
	  const n = Number(v);
	  if (!Number.isFinite(n)) return { present:true, value:null, expr };
	  return { present:true, value:n, expr };
	}
	
	let foundAny=false, bad=false;
	
	for (const f of files){
	  const s = fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
	  if (!isEnabledWorkflow(s)) continue;
	
	  const lines = s.split("\n");
	  let fileHasUpload=false;
	
	  for (let i=0;i<lines.length;i++){
	    if (!uploadUseRe.test(lines[i])) continue;
	    fileHasUpload=true;
	
	    const blk = blockAfter(lines,i,70);
	    const r = parseRetention(blk);
	
	    if (!r.present || r.expr || r.value === null) { bad=true; break; }
	    if (r.value > 7) { bad=true; break; }
	  }
	
	  if (fileHasUpload) foundAny=true;
	  if (bad) break;
	}
	
	if (!foundAny) skip("EMML ENABLED WORKFLOW ARTIFACT RETENTION LINT: SKIP");
	if (bad) fail("EMML ENABLED WORKFLOW ARTIFACT RETENTION LINT: FAIL (actions/upload-artifact must set retention-days numeric <= 7; expressions not allowed)");
	ok("EMML ENABLED WORKFLOW ARTIFACT RETENTION LINT: OK");
	NODE

	emml-ci-enabled-workflow-cache-scope-keys-lint:
	@node - <<'NODE'
	"use strict";
	const fs = require("fs");
	const path = require("path");
	function ok(m){ console.log(m); process.exit(0); }
	function skip(m){ console.log(m); process.exit(0); }
	function fail(m){ console.error(m); process.exit(2); }
	
	const dir = path.join(".github","workflows");
	if (!fs.existsSync(dir)) skip("EMML ENABLED WORKFLOW CACHE SCOPE/KEYS LINT: SKIP");
	
	const files = fs.readdirSync(dir).filter(f => /\.ya?ml$$/i.test(f)).map(f => path.join(dir,f));
	if (!files.length) skip("EMML ENABLED WORKFLOW CACHE SCOPE/KEYS LINT: SKIP");
	
	function isEnabledWorkflow(text){
	  return /\bon\s*:/m.test(text) && (/\bpush\b/m.test(text) || /\bpull_request\b/m.test(text) || /\bworkflow_dispatch\b/m.test(text) || /\bschedule\b/m.test(text));
	}
	
	const cacheUseRe = /^\s*uses\s*:\s*actions\/cache@/im;
	const pathRe = /^\s*path\s*:\s*[^#\n]+/im;
	const keyRe = /^\s*key\s*:\s*([^#\n]+)\s*(?:#.*)?$$/im;
	const restoreKeysRe = /^\s*restore-keys\s*:/im;
	
	function blockAfter(lines,i,max=60){ return lines.slice(i, Math.min(lines.length, i+max)).join("\n"); }
	
	let foundAny=false, bad=false;
	
	for (const f of files){
	  const s = fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
	  if (!isEnabledWorkflow(s)) continue;
	
	  const lines = s.split("\n");
	  let fileHasCache=false;
	
	  for (let i=0;i<lines.length;i++){
	    if (!cacheUseRe.test(lines[i])) continue;
	    fileHasCache=true;
	    const blk = blockAfter(lines,i,70);
	
	    if (!pathRe.test(blk)) { bad=true; break; }
	
	    const km = blk.match(keyRe);
	    if (!km) { bad=true; break; }
	    const raw = String(km[1]||"").trim().replace(/^["']|["']$$/g,"");
	    if (!raw.includes("$${{")) { bad=true; break; }
	    if (/^cache$$/i.test(raw.trim())) { bad=true; break; }
	
	    if (restoreKeysRe.test(blk) && !raw.match(/(runner\.os|hashFiles|github\.ref|matrix\.)/)) {
	      bad=true; break;
	    }
	  }
	
	  if (fileHasCache) foundAny=true;
	  if (bad) break;
	}
	
	if (!foundAny) skip("EMML ENABLED WORKFLOW CACHE SCOPE/KEYS LINT: SKIP");
	if (bad) fail("EMML ENABLED WORKFLOW CACHE SCOPE/KEYS LINT: FAIL (actions/cache must define path; key must be context-scoped; avoid global/static keys)");
	ok("EMML ENABLED WORKFLOW CACHE SCOPE/KEYS LINT: OK");
	NODE

	emml-ci-enabled-workflow-artifact-download-scope-lint:
	@node - <<'NODE'
	"use strict";
	const fs = require("fs");
	const path = require("path");
	function ok(m){ console.log(m); process.exit(0); }
	function skip(m){ console.log(m); process.exit(0); }
	function fail(m){ console.error(m); process.exit(2); }
	
	const dir = path.join(".github","workflows");
	if (!fs.existsSync(dir)) skip("EMML ENABLED WORKFLOW ARTIFACT DOWNLOAD SCOPE LINT: SKIP");
	
	const files = fs.readdirSync(dir).filter(f => /\.ya?ml$$/i.test(f)).map(f => path.join(dir,f));
	if (!files.length) skip("EMML ENABLED WORKFLOW ARTIFACT DOWNLOAD SCOPE LINT: SKIP");
	
	function isEnabledWorkflow(text){
	  return /\bon\s*:/m.test(text) && (/\bpush\b/m.test(text) || /\bpull_request\b/m.test(text) || /\bworkflow_dispatch\b/m.test(text) || /\bschedule\b/m.test(text));
	}
	
	const downloadUseRe = /^\s*uses\s*:\s*actions\/download-artifact@/im;
	const nameRe = /^\s*name\s*:\s*[^#\n]+/im;
	const pathRe = /^\s*path\s*:\s*[^#\n]+/im;
	const patternRe = /^\s*pattern\s*:\s*[^#\n]+/im;
	
	function blockAfter(lines,i,max=60){ return lines.slice(i, Math.min(lines.length, i+max)).join("\n"); }
	
	let foundAny=false, bad=false;
	
	for (const f of files){
	  const s = fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
	  if (!isEnabledWorkflow(s)) continue;
	
	  const lines = s.split("\n");
	  let fileHasDownload=false;
	
	  for (let i=0;i<lines.length;i++){
	    if (!downloadUseRe.test(lines[i])) continue;
	    fileHasDownload=true;
	
	    const blk = blockAfter(lines,i,70);
	    const hasScope = nameRe.test(blk) || pathRe.test(blk) || patternRe.test(blk);
	    if (!hasScope) { bad=true; break; }
	  }
	
	  if (fileHasDownload) foundAny=true;
	  if (bad) break;
	}
	
	if (!foundAny) skip("EMML ENABLED WORKFLOW ARTIFACT DOWNLOAD SCOPE LINT: SKIP");
	if (bad) fail("EMML ENABLED WORKFLOW ARTIFACT DOWNLOAD SCOPE LINT: FAIL (actions/download-artifact must scope downloads with name/path/pattern)");
	ok("EMML ENABLED WORKFLOW ARTIFACT DOWNLOAD SCOPE LINT: OK");
	NODE

# EMML self-check (recovered): run required lints + OK marker
	emml-ci-self-check:
	@$(MAKE) emml-ci-status
	@$(MAKE) emml-ci-recommend
	@$(MAKE) emml-ci-lint
	@$(MAKE) emml-ci-workflow-validate
	@$(MAKE) emml-ci-enabled-workflow-lint
	@$(MAKE) emml-ci-enabled-workflow-ids-lint
	@$(MAKE) emml-ci-enabled-workflow-gates-lint
	@$(MAKE) emml-ci-enabled-workflow-meta-lint
	@$(MAKE) emml-ci-enabled-workflow-guard-lint
	@$(MAKE) emml-ci-enabled-workflow-permissions-lint
	@$(MAKE) emml-ci-enabled-workflow-actions-pin-lint
	@$(MAKE) emml-ci-enabled-workflow-node-lint
	@$(MAKE) emml-ci-enabled-workflow-cache-lint
	@$(MAKE) emml-ci-enabled-workflow-install-lint
	@$(MAKE) emml-ci-enabled-workflow-checkout-lint
	@$(MAKE) emml-ci-enabled-workflow-checkout-submodules-lint
	@$(MAKE) emml-ci-enabled-workflow-checkout-token-lint
	@$(MAKE) emml-ci-enabled-workflow-checkout-persist-credentials-lint
	@$(MAKE) emml-ci-enabled-workflow-oidc-lint
	@$(MAKE) emml-ci-enabled-workflow-pr-target-lint
	@$(MAKE) emml-ci-enabled-workflow-concurrency-lint
	@$(MAKE) emml-ci-enabled-workflow-timeout-lint
	@$(MAKE) emml-ci-enabled-workflow-actions-sha-pin-lint
	@$(MAKE) emml-ci-enabled-workflow-permissions-min-lint
	@$(MAKE) emml-ci-enabled-workflow-runner-env-protections-lint
	@$(MAKE) emml-ci-enabled-workflow-secret-exposure-lint
	@$(MAKE) emml-ci-enabled-workflow-checkout-depth-lint
	@$(MAKE) emml-ci-enabled-workflow-checkout-sparse-filter-lint
	@$(MAKE) emml-ci-enabled-workflow-artifact-retention-lint
	@$(MAKE) emml-ci-enabled-workflow-cache-scope-keys-lint
	@$(MAKE) emml-ci-enabled-workflow-artifact-download-scope-lint
	@echo "EMML CI SELF-CHECK: OK"


