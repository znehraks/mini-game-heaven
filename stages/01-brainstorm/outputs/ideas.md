# Brainstorming Report: Mini-Game Heaven

> Generated: 2026-01-22
> AI Model: Gemini (Creative Explorer Persona)
> Stage: 01-brainstorm

---

## 1. Core Feature Ideas
*Focusing on retention, social friction, and ad-inventory optimization.*

| # | Feature Name | User Value | Complexity | Innovation |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **The "Nemesis" Notification** | Instead of generic alerts, users get a specific ping: *"User123 just stole your Rank #5 spot!"* Triggers immediate emotional response to reclaim territory. | Medium | 4/5 |
| **2** | **"Second Chance" Ad-Revive** | Died at a high score? Watch a 15s ad to continue exactly where you left off. (Standard hyper-casual monetization). | Low | 2/5 |
| **3** | **Global "Vibe" Skin Shop** | Use points earned in *any* game to buy global UI themes (e.g., Cyberpunk, Pixel, Vaporwave) that change the entire site's CSS/music. | Medium | 4/5 |
| **4** | **Cross-Game Daily Quests** | "Score 500 in Game A and 200 in Game B." Encourages users to try games they usually ignore, increasing total platform dwell time. | Medium | 3/5 |
| **5** | **"Ghost" Replays** | See a translucent recording of the friend who is one rank above you while you play. Acts as a visual pacer. | High | 5/5 |
| **6** | **Rage-Quit Meter** | A global counter on the homepage showing how many times users died/failed today. Creates a sense of shared community struggle. | Low | 3/5 |
| **7** | **Speedrun Mode (No Ads)** | A specific mode where gameplay is faster; accessible only by "paying" with a high amount of in-game currency (earned by watching ads previously). | Medium | 3/5 |
| **8** | **Discord Integration/Auth** | Since the target is teens, allow login via Discord and display their "Now Playing" status on their Discord profile to drive organic traffic. | Low | 3/5 |
| **9** | **The "Golden Ticket" Hour** | Random 1-hour windows where all point gains are doubled. Notifications sent via PWA. Drives massive concurrent traffic spikes. | Medium | 3/5 |
| **10** | **One-Handed Mode Toggle** | UI adaptation ensuring all games can be played comfortably on mobile while holding a handle (subway/bus use case). | High (Design) | 4/5 |

---

## 2. Mini Game Ideas
*Philosophy: Mechanics that require 1 tap/click but demand high precision.*

### Game 1: Neon Tower Stack
- **Description:** Blocks slide in from left/right. Tap to drop. Overhanging parts get sliced off.
- **Mechanic:** Rhythm/Timing. The tower gets thinner as you mess up.
- **Session:** 30s - 2m.
- **Progression:** Sliding speed increases; blocks become invisible for split seconds.

### Game 2: Gravity Switcher
- **Description:** An endless runner where the character runs on the floor or ceiling. Tap to flip gravity.
- **Mechanic:** Reflex. Avoid spikes on top and bottom.
- **Session:** 45s.
- **Progression:** Gap between spikes narrows; game speed accelerates.

### Game 3: Color Rush (Stroop Effect)
- **Description:** A word appears (e.g., "RED") colored in blue ink. You must tap the button matching the *ink color*, not the word.
- **Mechanic:** Cognitive dissonance/Focus.
- **Session:** 20s (very intense).
- **Progression:** Time limit per decision decreases from 1s to 0.3s.

### Game 4: Orbit Defender
- **Description:** You control a shield rotating around a planet. Tap to change rotation direction. Block incoming meteors.
- **Mechanic:** Radial timing.
- **Session:** 1m.
- **Progression:** Meteors come in complex patterns and vary in speed.

### Game 5: Perfect Pour
- **Description:** Hold space/screen to pour liquid into a glass. Release to stop. Must hit a specific fill line variance (e.g., 95-100%).
- **Mechanic:** Risk/Reward intuition.
- **Session:** 15s (rapid fire rounds).
- **Progression:** Target zone gets smaller; glass shape becomes irregular.

### Game 6: Laser Hop
- **Description:** A vertical jumper. Lasers appear horizontally. You must jump *through* them when they blink off, or over them.
- **Mechanic:** Timing windows.
- **Session:** 45s.
- **Progression:** Lasers blink faster; platforms start moving.

### Game 7: Math Ninja
- **Description:** Simple arithmetic equations fall from the sky. Slice (tap) the correct answer before it hits the ground.
- **Mechanic:** Speed Math.
- **Session:** 1m.
- **Progression:** Equations move from `2+2` to `12*4` to `(5+3)*2`.

### Game 8: Digit Lock
- **Description:** A number counts up rapidly (0-9). Tap to stop it exactly on the target number. Unlock 3 tumblers to clear a level.
- **Mechanic:** High-speed visual reflex.
- **Session:** 30s.
- **Progression:** Counter speed blurs; numbers rotate.

### Game 9: Drift King (2D)
- **Description:** Top-down view of a car. Tap and hold to turn right, release to go straight (or turn left). Stay on the winding track.
- **Mechanic:** Physics/Centrifugal force management.
- **Session:** 1m.
- **Progression:** Track gets narrower; icy patches reduce friction.

### Game 10: The Silence
- **Description:** You are a dot. Do not touch the walls. The maze moves around you.
- **Mechanic:** Precision cursor/finger control (Operation game style).
- **Session:** 2m.
- **Progression:** Walls begin to pulse and rotate.

---

## 3. User Personas

### Persona A: The "Bus Ride" Gamer
- **Name:** Min-jun (15, High School Student)
- **Context:** Rides the bus to school/cram school (20 min commute).
- **Goals:** Kill time, wake up his brain, beat his friend's high score from yesterday.
- **Frustrations:** Games that take too long to load, require two hands (he's holding a handle), or require sound (he forgot his earbuds).
- **Tech:** Mid-range Android, relies on PWA to save data.

### Persona B: The "Clout Chaser"
- **Name:** Ji-ah (17, Influencer wannabe)
- **Context:** Hanging out in Discord servers or Group Chats.
- **Goals:** Wants to be #1 on the leaderboard to screenshot it and post it on Instagram/Kakao/Discord. Wants "aesthetic" games.
- **Frustrations:** Ugly interfaces, games that feel "cheap" or "buggy," lack of share buttons.
- **Tech:** Latest iPhone, high expectations for UI responsiveness.

### Persona C: The "Procrastinator"
- **Name:** Do-hyun (19, University Freshman)
- **Context:** Supposed to be studying in the library.
- **Goals:** A quick dopamine hit to distract from studying.
- **Frustrations:** Complex tutorials. He wants to understand the game in 3 seconds.
- **Tech:** Laptop (MacBook Air) or Tablet.

---

## 4. Competitor Analysis

| Competitor | Strengths | Weaknesses | Opportunity |
| :--- | :--- | :--- | :--- |
| **CrazyGames / Poki** | Massive library (1000s of games). Strong SEO. | Overwhelming/Cluttered UI. Low quality control. Feels "generic." | **Curated Quality:** Offer fewer, but higher polish games with a unified aesthetic (Vaporwave/Y2K). |
| **Instagram/TikTok Filter Games** | Extremely social, integrated into apps teens already use. | Ephemeral (hard to find again), no long-term progression/profile. | **Persistence:** Offer the same simple fun but with a profile history and global leaderboards. |
| **Dinosaur Game (Chrome)** | Instantly accessible, zero load time, iconic. | Only available when offline (mostly), very limited mechanics. | **Access + Depth:** Recreate that "instant load" feeling via PWA but add color, music, and social competition. |

---

## 5. Crazy 10x Ideas

### Idea 1: Battle Royale Arcade (1 vs 99)
- **Concept:** 100 players start "Tower Stack" simultaneously via Supabase Realtime. When you die, you are out. Last one standing wins a digital trophy.
- **Impact:** Creates massive "event" feelings. Moves from single-player isolation to high-stakes social gaming.

### Idea 2: "Play to Donate" (Ad Revenue Share)
- **Concept:** Partner with a charity. A percentage of ad revenue generated by the top 10 players' session time is donated to a cause of their choice.
- **Impact:** Gives teens a "moral license" to play games. "I'm not wasting time, I'm raising money for stray cats."

### Idea 3: Cross-Reality "School vs. School" Warfare
- **Concept:** Users select their real-world high school. Leaderboards aren't just individuals, but aggregated school scores. "School A is beating School B."
- **Impact:** Virality explosion. Students will force their classmates to play to defend their school's honor. (Requires strict moderation).

---

## 6. Feature Priority Matrix

| Priority | Feature | Rationale |
|----------|---------|-----------|
| P0 (MVP) | Core game mechanics (3-5 games) | Must have playable content |
| P0 (MVP) | Basic leaderboard | Competition drives retention |
| P0 (MVP) | PWA support | Mobile-first for teens |
| P1 | Nemesis notifications | High engagement, medium effort |
| P1 | Ad-revive system | Monetization core |
| P1 | Discord auth | Target audience alignment |
| P2 | Ghost replays | High innovation, high complexity |
| P2 | Global skin shop | Engagement booster |
| P3 | Battle Royale mode | Future viral feature |
| P3 | School vs School | Requires scale + moderation |

---

## 7. Key Insights

1. **One-Hand Playability**: All games should be designed for single-tap/hold mechanics for commute scenarios
2. **Sub-2-Minute Sessions**: Games should feel complete within 2 minutes to fit between activities
3. **Visual Shareability**: Scores and achievements should be screenshot-friendly for social sharing
4. **Instant Gratification**: Zero tutorial, immediate play - "understand in 3 seconds"
5. **Social Friction**: Nemesis notifications and leaderboards create emotional investment

---

*End of Brainstorming Report*
