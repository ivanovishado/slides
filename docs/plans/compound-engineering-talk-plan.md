# De prompts desechables a sistemas que aprenden: Una introducción a Compound Engineering

## Purpose

This document is the source-of-truth content plan for a roughly 30-minute presentation about Compound Engineering for a knowledgeable software audience. It is intentionally written as a handoff artifact: an agent should be able to build the slides from this file without needing the prior conversation.

The talk should persuade the audience that one-off AI prompts are not enough. A prompt can produce code, but if the intent, tradeoffs, review findings, and lessons disappear afterward, the team has only accelerated output, not learning. Compound Engineering is presented as the alternative: an engineering operating model where each task leaves behind durable context that makes future work easier.

The published title is Spanish and should appear exactly as:

> De prompts desechables a sistemas que aprenden: Una introducción a Compound Engineering

The body slide text should be in English. It is acceptable to keep the Spanish title on the cover and reference it verbally in Spanish if useful.

## Core Thesis

Disposable prompts create disposable context. Compound Engineering turns engineering work into a learning system by reinvesting the knowledge created during planning, implementation, review, and debugging into durable artifacts that future humans and agents can reuse.

The talk has three conceptual anchors:

1. **Bus factor as context risk**: projects stall when important context lives only in a few developers' heads.
2. **Second Brain as familiar bridge**: many people already understand externalizing personal knowledge; Compound Engineering extends that idea to team-and-agent engineering memory.
3. **Compound investing as mental model**: gains only compound when they are reinvested. In engineering, the reinvested gains are plans, tests, review findings, documented patterns, project instructions, and solution notes.

The actionable takeaway should be concrete:

> Run one nontrivial feature through a Compound Engineering skill loop: `/ce-brainstorm` -> `/ce-plan` -> `/ce-work` -> `/ce-review` -> `/ce-compound`. Do not stop at generated code. End with a reusable artifact.

The slide deck should make clear that the concrete workflow is being referenced through Every's Compound Engineering plugin because it is the easiest practical on-ramp. The broader argument is not plugin-specific: any engineering workflow can compound if it captures learning into durable, retrievable artifacts.

## Audience and Tone

The audience is knowledgeable. Assume they understand modern AI coding assistants, agents, code review, CI, and the pain of maintaining real software systems. Do not spend time explaining what an LLM is or why AI can write code.

The tone should be practical and sharp rather than inspirational. The talk should feel like a senior engineer explaining a better operating model after seeing where naive AI-assisted development breaks down.

Avoid turning the talk into a product demo. Tool names and skill names are useful because they make the workflow concrete, but the argument is broader than any one plugin.

## Sources and Research Anchors

Use these as conceptual references and optional link targets on the outro slide:

- Every: "Compound Engineering: How Every Codes with Agents"  
  https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents
- EveryInc compound-engineering-plugin repo  
  https://github.com/EveryInc/compound-engineering-plugin
- EveryInc compound-engineering-plugin skill documentation  
  https://github.com/EveryInc/compound-engineering-plugin/blob/main/docs/skills/README.md
- Every Source Code: "My AI Had Already Fixed the Code Before I Saw It"  
  https://every.to/source-code/my-ai-had-already-fixed-the-code-before-i-saw-it
- Berkeley BAIR: "The Shift from Models to Compound AI Systems"  
  https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/
- Tiago Forte / Forte Labs: Building a Second Brain overview  
  https://fortelabs.com/blog/basboverview/
- Bus factor definition and framing  
  https://en.wikipedia.org/wiki/Bus_factor
- Bus Factor in Practice paper  
  https://arxiv.org/abs/2202.01523
- Compound interest analogy  
  https://www.investopedia.com/terms/c/compound.asp

## Narrative Arc

The deck should move through five phases:

1. **Problem**: AI prompts can produce useful code but often leave no reusable context behind.
2. **Risk**: this compounds existing bus-factor problems because project knowledge stays trapped in people, chats, and transient prompts.
3. **Bridge**: a Second Brain makes external memory familiar; software teams need an engineering Second Brain that agents can also use.
4. **Model**: compounding explains why durable artifacts matter: learning must be reinvested into the project.
5. **Action**: the Compound Engineering skill loop gives the audience a concrete workflow to try.

## Slide-by-Slide Plan

### 1. Cover

**Title:** De prompts desechables a sistemas que aprenden: Una introducción a Compound Engineering

**Slide goal:** Establish the premise and make the official title memorable. This slide should frame the talk as a shift from ephemeral AI interaction to durable learning systems.

**Layout:** Full-bleed title slide. Use the Spanish title as the dominant visual element. Add a smaller English subtitle: "From disposable prompts to learning engineering systems." Include speaker name, date/event, and optionally a small repo/social handle if available.

**What to say:** Open by acknowledging that many teams are already using AI to move faster, but speed is not the interesting question. The interesting question is whether the system learns from each use.

**Image to generate:** A cinematic technical illustration where disposable prompt fragments on the left transform into a structured engineering flywheel on the right. The visual should imply movement from throwaway interaction to persistent system memory. Avoid cartoon styling; make it feel like a serious engineering keynote.

**Implementation notes:** Keep the Spanish title exact. Do not shorten it on this slide.

### 2. Speaker Intro

**Title:** Why I care about this

**Slide goal:** Give the audience enough context to trust the speaker and understand why this topic is grounded in real engineering work.

**Layout:** Speaker photo or portrait area on the left. On the right, use three concise bullets:

- What I build or lead
- Where AI agents fit into my engineering work
- Why context and maintainability matter to me

**What to say:** Keep the intro short. The point is not biography; it is credibility. Explain that the talk comes from the practical tension between faster code generation and harder long-term maintenance.

**Image to generate:** Prefer a real speaker photo if available. If no photo is supplied, use a generated abstract background showing a repo graph, terminal, and documentation artifacts arranged like an engineering control room. Leave space for a future headshot.

**Implementation notes:** Use placeholders for name, role, company/community, and links until the speaker details are supplied.

### 3. Hook: The Prompt Disappears

**Title:** The prompt disappears

**Slide goal:** Make the central problem concrete: a prompt can be useful in the moment while still leaving no durable institutional value.

**Layout:** One dominant statement: "A prompt can ship code and still leave nothing behind." Under it, add three small supporting labels: "not reviewed", "not retrieved", "not improved".

**What to say:** A prompt is often treated like a disposable wrapper around the real output. Once the code lands, the context that produced it is gone: the user's intent, constraints, false starts, assumptions, and rationale.

**Image to generate:** A terminal prompt fading out after execution while the generated code remains. The fading prompt should visually suggest loss of context rather than success.

**Implementation notes:** This should be sparse and high contrast. The slide should feel like the first thesis punch, not an explanatory page.

### 4. Disposable Prompts Create Context Debt

**Title:** Disposable prompts create context debt

**Slide goal:** Name the hidden cost. The issue is not that prompts are bad; it is that throwaway prompting fails to preserve the information needed for the next change.

**Layout:** Three-column grid:

- **Intent**: what the user meant
- **Constraints**: what the solution had to respect
- **Taste**: what made the result acceptable

Each column should include one short example line.

**What to say:** Code is not the only output of engineering. The decision process is also valuable. When that process disappears, the next person or agent has to rediscover it.

**Image to generate:** Scattered sticky notes and chat fragments sitting outside a clean repository boundary. The repo should look organized; the missing context should look unindexed and fragile.

**Implementation notes:** Avoid making this feel anti-AI. The point is that prompts need a system around them.

### 5. The Bus Factor Is a Context Factor

**Title:** The bus factor is a context factor

**Slide goal:** Connect the topic to a familiar engineering risk. Bus factor is not only about who can type code; it is about who holds the project model in their head.

**Layout:** Large "1" or "2" as the visual risk indicator. Surround it with labels: "architecture", "edge cases", "product judgment", "deployment habits", "review taste".

**What to say:** A low bus factor means the project depends on a small number of people. Often the real dependency is not access or skill; it is context. The person knows why things are shaped the way they are.

**Image to generate:** A single developer silhouette holding a glowing map of the system while other team members see only isolated fragments. The image should feel like concentration of knowledge, not hero worship.

**Implementation notes:** This slide should set up the later claim that Compound Engineering lowers bus factor by moving context into shared artifacts.

### 6. AI Can Make This Worse

**Title:** AI can make this worse

**Slide goal:** Challenge the assumption that AI automatically solves knowledge bottlenecks. AI can increase output while increasing context loss if the workflow stays ephemeral.

**Layout:** Two-column contrast:

- **Before:** human-only tribal knowledge
- **After:** human + AI disposable context

Add a bottom line: "More throughput does not automatically mean more learning."

**What to say:** If every AI session starts from scratch, then the team has not created a learning system. It has created a faster way to generate undocumented decisions.

**Image to generate:** A high-speed conveyor belt producing code while context notes fall off the side. The image should imply speed with leakage.

**Implementation notes:** Keep the critique balanced. The problem is not AI; the problem is using AI without durable feedback loops.

### 7. The Familiar Idea: A Second Brain

**Title:** A familiar idea: the Second Brain

**Slide goal:** Give the audience an accessible mental bridge. Many people already believe in externalizing knowledge so future-you can use it.

**Layout:** One central idea: "Externalize knowledge so future-you can reuse it." Add four small words from the Second Brain vocabulary: capture, organize, distill, express.

**What to say:** A Second Brain is compelling because it admits a truth: memory is unreliable and attention is scarce. We need systems that preserve useful knowledge outside our heads.

**Image to generate:** Personal notes, highlights, and diagrams expanding into a structured graph. The graph should look like a knowledge system, not a random mind map.

**Implementation notes:** Do not over-explain the Second Brain method. Use it as a bridge, not a detour.

### 8. From Personal Second Brain to Engineering Second Brain

**Title:** Teams need an engineering Second Brain

**Slide goal:** Extend the concept from personal productivity to software delivery. The repo and surrounding artifacts should store not only code, but reusable context.

**Layout:** Two-column mapping:

- **Personal Second Brain:** capture, organize, distill, express
- **Engineering Second Brain:** plan, encode, verify, reuse

Add a bottom statement: "The repo should remember how the team thinks."

**What to say:** In engineering, the useful memory includes decisions, failure modes, conventions, tests, architecture constraints, review standards, and past solutions. Agents can use that memory too, which changes the leverage.

**Image to generate:** A notebook transforming into repository artifacts: `AGENTS.md`, tests, plans, review notes, and solution docs.

**Implementation notes:** This slide should naturally lead into the central question on the next slide.

### 9. The Core Question

**Title:** The core question

**Slide goal:** Pause the argument and give the audience a simple lens for the rest of the talk.

**Layout:** Centered question only: "What would it mean for every engineering task to make the next one easier?"

**What to say:** This is the standard the rest of the talk uses. If a task ships but does not improve the system's ability to handle future tasks, it may be efficient but it is not compounding.

**Image to generate:** A forked path: one side labeled "output only" and the other "output + learning". Keep the labels subtle; the main focus should remain the question.

**Implementation notes:** Use this slide as a pacing reset before introducing the investment analogy.

### 10. Compound Investing: The Mental Model

**Title:** Compounding requires reinvestment

**Slide goal:** Introduce the investment analogy clearly. Compound growth happens because returns are reinvested into the principal.

**Layout:** Simple visual chart: linear growth vs compound growth. Under the chart, include a mapping:

- Principal = project context
- Return = solved work
- Reinvestment = durable artifacts

**What to say:** Compounding is not magic. If you spend the returns, nothing compounds. In engineering, the equivalent of spending the returns is shipping code while discarding the learning.

**Image to generate:** A financial compounding curve morphing into a curve made of engineering artifacts: commits, tests, docs, review notes.

**Implementation notes:** Keep the chart conceptually simple. Do not introduce real financial formulas.

### 11. Compound Engineering Defined

**Title:** Compound Engineering

**Slide goal:** Give the talk's main definition.

**Layout:** Definition as the hero text:

> Each unit of engineering work should make subsequent units easier, not harder.

Below it, include four supporting ideas: codify decisions, automate checks, preserve taste, retrieve past solutions.

**What to say:** Compound Engineering is not just using agents. It is designing the engineering workflow so agents and humans leave behind reusable leverage after every meaningful piece of work.

**Image to generate:** A flywheel labeled Plan, Work, Review, Compound. It should feel mechanical and durable.

**Implementation notes:** This is the conceptual midpoint. Make it visually authoritative.

### 12. Actionable Anchor: The Skill Loop

**Title:** The skill loop you can try

**Slide goal:** Give the audience one concrete, memorable workflow. This is the key actionable slide. It should anchor the abstract idea in a repeatable sequence.

**Layout:** Horizontal workflow using command-like skill names:

`/ce-brainstorm` -> `/ce-plan` -> `/ce-work` -> `/ce-review` -> `/ce-compound`

Under each skill, add one short function:

- **`/ce-brainstorm`**: clarify what to build
- **`/ce-plan`**: capture how to build it
- **`/ce-work`**: execute against the plan
- **`/ce-review`**: scale critique and catch gaps
- **`/ce-compound`**: document what the team learned

Add the takeaway line: "Do not stop at generated code. End with a reusable artifact."

**What to say:** This is the part the audience can take home. Say explicitly that this workflow comes from Every's Compound Engineering plugin, and that the plugin is useful because it makes the practice easy to try immediately. The specific commands are less important than the shape of the loop: clarify intent, plan with context, execute, review, then reinvest the learning. The final step is what prevents the work from becoming another disposable AI session.

**Image to generate:** A command-line workflow where each command produces an artifact that is deposited into persistent repo memory. The final artifact should visibly feed back into the beginning of the loop.

**Implementation notes:** This slide should be highly legible. The skill names should be readable from the back of a room. Treat it as the slide people may photograph.

### 13. From Prompts to Systems

**Title:** From prompts to systems

**Slide goal:** Show the architectural shift. A disposable prompt chain is a sequence of isolated interactions; a learning system has memory, tools, verification, and feedback loops.

**Layout:** Left/right comparison:

- **Prompt chain:** user prompt -> model output -> code
- **Learning system:** instructions + plans + code + tests + reviewers + solution docs -> next task

**What to say:** Berkeley's compound AI systems framing is useful here: reliability often comes from orchestrating models with tools, retrieval, and control logic. Compound Engineering applies that systems view to software delivery.

**Image to generate:** On the left, a simple linear prompt bubble chain. On the right, a more robust machine with persistent memory, tests, docs, and review nodes connected in a loop.

**Implementation notes:** Do not make the system diagram too complex. The audience should understand it in five seconds.

### 14. Plan: Preserve Intent Before Code Exists

**Title:** Plan preserves intent

**Slide goal:** Explain why planning matters in an agent workflow. The point is not ceremony; the point is packaging context before execution.

**Layout:** Blueprint-style page with four blocks:

- Requirements
- Constraints
- Tradeoffs
- Success criteria

Add a small label: "A plan is a context package."

**What to say:** Planning creates a stable target for humans and agents. It captures the shape of the problem before implementation details begin to dominate the conversation.

**Image to generate:** An architectural blueprint overlaid with repository paths, acceptance checks, and constraint markers.

**Implementation notes:** Avoid implying that every tiny task needs a heavyweight plan. Say "nontrivial work" or "meaningful work" when presenting.

### 15. Work: Execution Consumes the Plan

**Title:** Work consumes the plan

**Slide goal:** Show how execution changes when it is grounded in captured context. The agent is not improvising from a vague prompt; it is working against a decision artifact.

**Layout:** Execution lane with checkpoints:

Plan -> branch/worktree -> implementation -> tests -> adaptation -> result

**What to say:** Good execution is not blind obedience to a plan. The agent still reads the repo, adapts to discovered facts, and verifies behavior. But the plan keeps the task oriented around the right goal.

**Image to generate:** A clean engineering assembly lane where each station validates the output before passing it along.

**Implementation notes:** Keep this slide practical. Mention tests and verification explicitly.

### 16. Review: Scale Taste and Skepticism

**Title:** Review scales skepticism

**Slide goal:** Explain why review is more than bug finding. It is a way to scale engineering taste and expose blind spots.

**Layout:** Grid of specialist lenses:

- Correctness
- Testing
- Maintainability
- Security
- Performance
- Architecture

**What to say:** Human reviewers are limited by time and attention. Specialized review agents can repeatedly check for classes of problems that humans often miss or defer. The most valuable review findings should feed the learning system. Use Every's "My AI Had Already Fixed the Code Before I Saw It" as a concrete story: the mature outcome is not just an agent writing code, but a system that investigates, fixes, and presents resolved findings before the human review pass.

**Image to generate:** A pull request or diff under multiple inspection lenses, each lens revealing a different class of issue.

**Implementation notes:** Avoid promising perfect review. Say "scale critique" or "increase coverage of skepticism."

### 17. Compound: Reinvest the Learning

**Title:** Compound means reinvest

**Slide goal:** Make the final step of the workflow vivid. The audience should understand that `/ce-compound` is where temporary learning becomes reusable knowledge.

**Layout:** Before/after pipeline:

Bug, review finding, hard-won decision -> reusable artifact

Reusable artifacts should include:

- test
- project instruction
- pattern doc
- solution note
- workflow improvement

**What to say:** If a bug is fixed but the lesson is not captured, the team bought a one-time fix. If the lesson becomes a test, instruction, or solution doc, the next occurrence is cheaper. Use the plugin docs' concrete model here: `/ce-compound` writes learnings into `docs/solutions/`, and later `/ce-brainstorm` and `/ce-plan` can use those notes as grounding. Searchable metadata or frontmatter is the small implementation detail that turns a lesson into retrievable system memory.

**Image to generate:** Insights being deposited into a vault or memory store that visibly powers the next engineering task.

**Implementation notes:** This slide should connect directly back to the compound investing analogy.

### 18. System Memory Beats Human Memory

**Title:** System memory beats human memory

**Slide goal:** Return to the bus-factor argument and show the operational benefit. Compound Engineering lowers context concentration.

**Layout:** Comparison table:

Human memory:

- unavailable
- inconsistent
- hard to transfer
- hard for agents to access

System memory:

- searchable
- reviewable
- executable
- shared by humans and agents

**What to say:** The goal is not to remove humans from engineering. The goal is to stop making the team depend on invisible, private memory for work that should be shared.

**Image to generate:** Knowledge moving from a single brain into a shared repository graph connected to multiple humans and agents.

**Implementation notes:** This slide should explicitly say that lowering bus factor does not mean devaluing senior engineers; it means amplifying their judgment.

### 19. Adoption Ladder

**Title:** Start with one rung

**Slide goal:** Make adoption feel feasible. The audience should not leave thinking they need to redesign their entire workflow immediately.

**Layout:** Five-rung ladder:

1. Write project instructions
2. Plan nontrivial work
3. Add automated review
4. Document solved problems
5. Run the full loop on bounded tasks

**What to say:** Start with the recurring pain that already costs your team time. If reviews are inconsistent, start with review. If agents keep missing conventions, start with project instructions. If bugs recur, start with documented solutions and tests.

**Image to generate:** A ladder where each rung is a durable artifact. The top of the ladder should point toward a learning system, not a generic success icon.

**Implementation notes:** Keep the slide practical. This is the adoption bridge before closing.

### 20. Close: The Real ROI

**Title:** The real ROI

**Slide goal:** Deliver the final thesis in one memorable statement.

**Layout:** Large closing statement:

> The goal is not one faster feature. The goal is a system that raises the baseline after every feature.

Add the final phrase below it: "Less disposable context. Lower bus factor. Better next change."

**What to say:** Reconnect all three analogies: disposable prompts lose context, Second Brain externalizes memory, and compounding requires reinvestment. Compound Engineering is the practice of making the engineering system learn.

**Image to generate:** A rising compounding curve built out of commits, tests, docs, review cards, and agent instructions.

**Implementation notes:** This should feel like the emotional ending of the talk. Do not overload it with links; that comes next.

### 21. Outro: Links and Next Steps

**Title:** Links and next steps

**Slide goal:** Give the audience a place to go next and one concrete action.

**Layout:** Three or four link blocks with QR codes or short URLs:

- Speaker socials
- Presentation repo
- Compound Engineering/plugin repo
- Optional article/resources list

Add one CTA: "Try the loop on one real feature this week."

**What to say:** Keep it brief. Invite people to try the workflow on a real task, not a toy prompt.

**Image to generate:** Clean link hub with a subtle repo graph or flywheel in the background. The QR/link blocks must remain highly readable.

**Implementation notes:** Use placeholders until exact links are known. This slide should be functional more than decorative.

## Timing Guidance

Target 21 slides over about 30 minutes. Suggested pacing:

- Slides 1-2: 2 minutes total
- Slides 3-6: 6 minutes total
- Slides 7-11: 8 minutes total
- Slide 12: 3 minutes, because it is the actionable anchor
- Slides 13-19: 9 minutes total
- Slides 20-21: 2 minutes total

The deck can run shorter by compressing slides 14-17 verbally, since slide 12 already establishes the full workflow.

## Visual Direction for Later Implementation

The visual system should feel like serious technical editorial design: precise, high-contrast, and artifact-driven. The subject is engineering systems, not generic AI futurism.

Recommended motifs:

- repo graphs
- command-line workflows
- review lenses
- knowledge vaults
- flywheels
- compounding curves
- technical blueprints

Avoid:

- generic robot imagery
- mystical AI glow
- playful cartoons
- busy stock photos
- vague neural-network backgrounds without connection to the slide argument

## Open Placeholders

These details are intentionally left for the implementation phase:

- Speaker name, role, and short bio bullets
- Speaker headshot or portrait choice
- Social links
- Presentation repository URL
- Whether to include QR codes
- Final theme, typography, palette, and motion level

## Acceptance Criteria for the Future Slide Deck

The final deck should be successful if:

- A viewer can explain why disposable prompts create context debt.
- A viewer can connect bus factor to context trapped in people's heads.
- A viewer understands Second Brain as a bridge, not the main thesis.
- A viewer understands the investment analogy: learning compounds only when reinvested.
- A viewer leaves with the concrete workflow: `/ce-brainstorm` -> `/ce-plan` -> `/ce-work` -> `/ce-review` -> `/ce-compound`.
- Every slide has one primary idea and does not depend on speaker-only context to make sense.
- The outro gives the audience links and a clear next action.
