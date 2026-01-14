# Terminal heredoc recovery (when you see )

If your shell shows a prompt like:

    heredoc>

it means a command you started is waiting for the heredoc terminator line.

## Fix (safe, immediate)
1) Type the terminator you started with on its own line, then press Enter.
   - Common terminators: , , , 
2) If you are unsure what terminator was used, press **Ctrl+C** to abort.

## Prevention rule for Lumora scripts
- Do not generate docs via shell heredocs.
- Prefer  (writeFileSync) or dedicated generators.
