# Story cut playbook: one per new episode

What we do for each new Life Shift episode on YouTube: one 8 to 12 minute story segment plus one vertical Short that links to it. Matt has approved posting these as Public once they pass the checks below.

## 1. Find the episode
- PodPage, podcast slug `life-shift`: newest episode. Note the guest, title, summary and `video_link` (the full-episode YouTube ID).
- vidIQ `vidiq_user_videos` for channel `UCOHCwAknh_mwD5f2Ss_hErg`: skip if a recent video already links to that episode.

## 2. Build from the raw recording, never the main edit
- Riverside `search_riverside` for the guest's name. Use the TAKE, with studio `62018474cd4b5c000a374d08`.
- `editing_create_edit_from_recording`. Cloning Matt's main edit and cutting it leaves the video full length, because its earlier cuts throw off the timing. This happened once already.

## 3. Pick the segment
- If the full episode has been up a while, check its retention curve (`vidiq_channel_analytics`, report `audience_retention`) and chapter jumps. Viewers skipping ahead to a chapter marks the story.
- Choose one continuous stretch of 8 to 12 minutes. Cold open on a strong guest line, never on Matt's question, and end on a line that lands.
- Get exact word times with `detail: "words"`.

## 4. Story cut (16:9)
- Cut `[0, start]` and `[end, duration minus about 300ms]`.
- `editing_remove_fillers` with method **Mute**. Cut and Smart leave visible jumps.
- Don't remove pauses.
- Verify the duration with `platform_get_edit` and read the first and last lines.

## 5. Short (9:16)
- New edit from the raw recording, then `update_aspect_ratio` 9:16 **before** any cuts.
- 25 to 60 seconds from inside the story. End half a second after the last word and at least 0.3 seconds before the next one.
- Fillers muted, and brand captions preset `ed202aea-461c-51eb-9219-9f0fedf4d6df`.

## 6. Titles and copy
- Score 4 or 5 titles with `vidiq_score_title` and pick the highest one that is accurate.
- The Short's title must not repeat the long title.
- Matt's voice: warm, reflective, understated, short sentences. No em or en dashes, no "it's this, not that" phrasing, no hype words.
- Long description:
  - a content note first, when the story involves death, abuse, violence or addiction
  - the story in two or three short paragraphs, using only facts from the recording
  - the full episode link
  - the guest's bio and links
  - 988 when the story involves grief, suicide or addiction
  - the follow and newsletter links
- Short description: one or two lines, then "The full story: <link>".

## 7. Publish
- Riverside `social_upload_create`, YouTube account `100674032504055625416`, Public, compose `{"quality":"1080p"}`.
- Story cut first. Get its ID from `social_get_upload_status`, then post the Short with that link in its description.
- Tags go on through `vidiq_update_video`.

## 8. Check
- `vidiq_video_watch` and `vidiq_watch_shortform_content`: first and last lines, length, jumps, cut-off words, captions.
- `vidiq_user_videos`: confirm the titles and tags. Something on the channel has been rewriting them after upload. Flag it and don't change it back.

## 9. Left for Matt
- End screens in YouTube Studio: the full episode plus one related story.
- A custom thumbnail, if wanted.

## Posted so far
| Guest | Story cut | Short |
|---|---|---|
| Ryan Roberts | 5gIh4skDcIY | 5YX7CMVjoBM |
| Robin Rosenbluth | cyZAsh6bL0g | 6Fk9Ys-iqSs |
| Sally McQuillen | si0wdhmiQgE | D1cRQeETPCA |
