. "$(cd "$(dirname "$0")/../.."  pwd)/.lumora_safe_bootstrap.sh"
#!/bin/sh
set -euo pipefail

# Usage:
#   sh scripts/guard/check_heredocs.sh            -> checks tracked scripts, prints failures, exits 1 if any
#   sh scripts/guard/check_heredocs.sh --file F   -> checks single file F, exits 1 if any
# Output on failure (TSV):
#   <file>\t<tag>\t<opener_line>\t<mode>
# mode is "plain" or "dash" (<<- allows TAB-indented closing tag)

check_one() {
  f="$1"
  [ -f "$f" ] || return 0

  awk -v FILE="$f" '
    function trim_cr(s){ sub(/\r$/, "", s); return s }
    function ltrim(s){ sub(/^[[:space:]]+/, "", s); return s }
    function rtrim(s){ sub(/[[:space:]]+$/, "", s); return s }

    # Parse heredoc tag from a substring starting right after "<<"
    # Supports: <<TAG, <<-TAG, <<'\''TAG'\'' , <<-"TAG" (rare)
    function parse_tag(rest,   dash, t, q, i, s) {
      dash=0
      rest=ltrim(rest)
      if (substr(rest,1,1)=="-") { dash=1; rest=ltrim(substr(rest,2)) }

      if (rest=="") return ""

      q=substr(rest,1,1)
      if (q=="'\''" || q=="\"") {
        s=substr(rest,2)
        i=index(s,q)
        if (i<=0) return ""
        t=substr(s,1,i-1)
      } else {
        # take first token until whitespace or one of: ; ) ] } |
        # (be conservative; a tag can be many things but should not contain spaces)
        t=rest
        sub(/[[:space:];\)\]\}\|].*$/, "", t)
      }
      if (t=="" || t ~ /[[:space:]]/) return ""
      tag=t
      mode=(dash? "dash":"plain")
      return tag SUBSEP mode
    }

    BEGIN {
      top=0
    }

    {
      line=trim_cr($0)

      # ignore full-line comments
      if (line ~ /^[[:space:]]*#/) next

      # check if this line closes the current top-of-stack heredoc
      if (top>0) {
        curTag=stackTag[top]
        curMode=stackMode[top]
        if (curMode=="plain") {
          if (line==curTag) { top--; next }
        } else {
          # <<- allows leading TABs before closing delimiter (not spaces)
          tmp=line
          sub(/^\t+/, "", tmp)
          if (tmp==curTag) { top--; next }
        }
      }

      # scan for heredoc openers on this line (can be multiple)
      # IMPORTANT: do not treat here-strings (<<<) as heredocs
      pos=1
      while (pos<=length(line)) {
        idx=index(substr(line,pos),"<<")
        if (idx==0) break
        at=pos+idx-1

        # skip here-string "<<<"
        if (substr(line, at, 3)=="<<<") { pos=at+3; continue }

        rest=substr(line, at+2)
        parsed=parse_tag(rest)
        if (parsed!="") {
          split(parsed, a, SUBSEP)
          tag=a[1]; mode=a[2]
          top++
          stackTag[top]=tag
          stackMode[top]=mode
          stackLine[top]=NR
        }
        pos=at+2
      }
    }

    END {
      # Any remaining stack entries are unterminated
      for (i=top; i>=1; i--) {
        printf "%s\t%s\t%d\t%s\n", FILE, stackTag[i], stackLine[i], stackMode[i]
        bad=1
      }
      exit(bad?1:0)
    }
  ' "$f"
}

mode="all"
single=""
if [ "${1:-}" = "--file" ]; then
  mode="one"
  single="${2:-}"
  [ -n "$single" ] || { echo "❌ --file requires a path" >&2; exit 2; }
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT INT TERM

if [ "$mode" = "one" ]; then
  if check_one "$single" >"$tmp"; then
    exit 0
  else
    cat "$tmp"
    exit 1
  fi
fi

# Fast, deterministic set of tracked shell scripts.
# Include: scripts/**.sh and root *.sh; exclude node_modules, .next, dist, .quarantine, .git.
files="$(git ls-files | awk '
  BEGIN{ }
  /^node_modules\// { next }
  /^\.(next|git)\// { next }
  /^dist\// { next }
  /^\.quarantine\// { next }
  /^scripts\/.*\.sh$/ { print; next }
  /^[^\/]+\.sh$/ { print; next }
')"

fail=0
for f in $files; do
  if check_one "$f" >>"$tmp"; then
    :
  else
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  cat "$tmp"
  exit 1
fi
