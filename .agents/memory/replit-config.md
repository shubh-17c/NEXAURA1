---
name: Validated Replit config
description: Replit-specific constraint for changing the project run configuration.
---

The `.replit` file is protected from direct edits in this environment; prepare the complete TOML in a temporary workspace file and replace it through the validated configuration flow.

**Why:** Direct patching of `.replit` is rejected, while validated replacement also keeps workflow metadata consistent.

**How to apply:** Use the validated replacement flow whenever the run command or Replit configuration needs to change.