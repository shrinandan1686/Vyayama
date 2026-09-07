# Model Usage Policy

Cost optimization is extremely important.

Assume Sonnet is the default model.

Only use Fable when the task genuinely benefits from frontier-level reasoning.

## Default (Sonnet)

Use Sonnet for:

- CRUD features
- UI implementation
- React Native
- Express
- FastAPI
- Refactoring
- Bug fixing
- Unit tests
- API implementation
- Styling
- Component creation
- Database work
- Graphify analysis
- Documentation
- Reading code
- Small architectural changes

Do NOT switch to Fable for these tasks.

---

## Use Fable only when necessary

Escalate to Fable ONLY if one or more of these is true:

- Large architectural redesign
- Multi-step system design
- Complex AI agent reasoning
- Difficult debugging after Sonnet fails
- Large cross-service refactoring
- Security review
- Performance optimization across many modules
- Algorithm design
- PRD generation
- Technical design documents
- Problems requiring significant reasoning

---

## Workflow

Always follow this order:

1. Use Graphify.
2. Analyze architecture.
3. Attempt solution using Sonnet.
4. Only if blocked because of reasoning complexity,
   recommend switching to Fable.

Never switch to Fable simply because the task is large.

Only switch if the reasoning itself requires it.

When recommending Fable, explain WHY. Never switch to Fable automatically.

If you believe Fable is needed:

1. Explain why.
2. Estimate why Sonnet may fail.
3. Wait for my approval.

Do not invoke Fable without confirmation. When working on this repository:

Use the cheapest model capable of completing the task well.

Assume Sonnet is sufficient.

Treat Fable as an escalation path, not the default.

Do not optimize for perfection.

Optimize for correctness, speed, and cost.

```
New feature
      ↓
Graphify
      ↓
Sonnet
      ↓
Can Sonnet finish?
      ↓
YES -----------------> Complete
      ↓
NO
      ↓
Explain why
      ↓
Ask permission
      ↓
Switch to Fable
```

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
