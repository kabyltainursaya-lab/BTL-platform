# How we built it

Short explanations of how parts of the BTL platform work, so we can answer
the judges' questions. (The full learning log is in `NOTES.md`.)

---

## Our YouTube episodes on the platform (22 Nov)

### What is a YouTube video ID?
Every YouTube video has a short code of **11 characters** (letters, numbers,
`-` and `_`). It's the part after `youtu.be/` or after `v=` in the link:

| Link | Video ID |
|---|---|
| `https://youtu.be/hQqT62hzt1k` | `hQqT62hzt1k` (Episode 1) |
| `https://www.youtube.com/watch?v=LMMPrvSPhYM` | `LMMPrvSPhYM` (Episode 2) |

We store **only the ID** in `data/episodes.json` (`"youtubeId"`). From that one
code, JavaScript builds everything else:
- the thumbnail: `https://i.ytimg.com/vi/ID/hqdefault.jpg`
- the player: `https://www.youtube-nocookie.com/embed/ID?autoplay=1`
- the "Watch on YouTube" link: `https://www.youtube.com/watch?v=ID`

### Why does the player load only after a click?
On the episode page you first see YouTube's thumbnail with **our own** cream
and pink play button. Only when you click it does JavaScript (`setupPlayer()`
in `js/episode.js`) replace the picture with the real YouTube player (an
`<iframe>`).
1. **Speed:** a YouTube player downloads a lot of extra code. A thumbnail is
   one small picture, so the page opens fast, even on a phone.
2. **Privacy:** YouTube doesn't load until the visitor chooses to watch. We
   also use `youtube-nocookie.com`, YouTube's privacy-friendly address.
3. **Design:** the play button matches our classic style, not YouTube red.

Because the visitor already pressed play once, the player starts with
`autoplay=1`, so they don't have to click a second time.

### New fields in `episodes.json`
| Field | Example | What it does |
|---|---|---|
| `youtubeId` | `"hQqT62hzt1k"` | Empty `""` = "Video coming soon". |
| `status` | `"published"` | Episodes 1 and 2 are now published. |
| `quizUrl` | Google Form link | "Test yourself" button under the player. It's our **after-watching** form (the B form). |
| `quizForms.before` / `.after` | Google Form links | "Before watching" (A form, pre-listening check) and "After watching" (B form) buttons in the Test yourself section. |

(`youtubeId` replaced the old `youtube` field.)

### Where the episodes appear
- **Episode page:** thumbnail → player in a card (max 760px wide, centred), then "Watch on YouTube" and "Test yourself" (new tab).
- **Episodes page:** published episodes show their thumbnail and a "Watch now" button.
- **Home:** the "Latest episodes" card shows both episodes with a thumbnail and "Watch now".

### Files changed
- `data/episodes.json`: `youtubeId`, `quizUrl`, `quizForms`, `status` for Episodes 1 and 2
- `js/app.js`: shared helpers `episodeVideoId()`, `youtubeThumbUrl()`, `youtubeWatchUrl()`, `episodeThumbHTML()`, and a play icon
- `js/episode.js`: the player (`videoHTML()` + `setupPlayer()`)
- `js/episodes.js`: thumbnail + "Watch now" on episode cards
- `js/home.js`: "Latest episodes" card
- `css/style.css`: player card, play buttons, thumbnails, phone layout
- `NOTES.md`: "How to publish a video" now uses `youtubeId`
- `HOW-WE-BUILT-IT.md`: this section (new file)
