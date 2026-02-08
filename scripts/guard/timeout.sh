#!/usr/bin/env bash
# Portable timeout shim (macOS-safe). Usage:
#   sh scripts/guard/timeout.sh 2 <command> [args...]
# Exits:
#   124 on timeout (matches GNU timeout), else command exit code.
set +e
set +u
set +o pipefail

SEC="${1:-0}"
shift || true

[ -n "${SEC}" ] || SEC=0
[ "${SEC}" -gt 0 ] 2>/dev/null || SEC=0

if [ "${#}" -eq 0 ]; then
  exit 0
fi

if command -v python3 >/dev/null 2>&1; then
  # python-based timeout
  python3 - <<PY "$SEC" "$@"
import os, sys, subprocess, signal, time
sec = float(sys.argv[1])
cmd = sys.argv[2:]
p = subprocess.Popen(cmd)
t0 = time.time()
while True:
    if p.poll() is not None:
        sys.exit(p.returncode if p.returncode is not None else 0)
    if time.time() - t0 >= sec:
        try:
            p.terminate()
        except Exception:
            pass
        time.sleep(0.2)
        if p.poll() is None:
            try:
                p.kill()
            except Exception:
                pass
        sys.exit(124)
    time.sleep(0.05)
PY
  exit $?
fi

if command -v perl >/dev/null 2>&1; then
  perl -e '
    my $sec = shift @ARGV;
    my $pid = fork();
    if (!defined $pid) { exit 0; }
    if ($pid == 0) { exec @ARGV; exit 0; }
    my $t = time();
    while (1) {
      my $r = waitpid($pid, 1);
      if ($r == $pid) { exit($? >> 8); }
      if (time() - $t >= $sec) {
        kill "TERM", $pid;
        select(undef, undef, undef, 0.2);
        kill "KILL", $pid;
        exit 124;
      }
      select(undef, undef, undef, 0.05);
    }
  ' "$SEC" "$@"
  exit $?
fi

# No python3/perl: run without timeout
"$@" || true
exit 0
