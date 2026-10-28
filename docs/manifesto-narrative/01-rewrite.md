# Manifesto narrative rewrite (Quote section)

File changed: `src/sections/Quote.tsx` only (plus this doc). Base HEAD `0384060`.
No commit, no push. `Header.tsx` and `docs/nav-symmetry/` untouched (nav round's work).

## Structure decision: kicker kept, body replaced across two elements

The label "DaivanLabs, in one sentence" is a separate mono kicker `<p>`, so it
is kept as the kicker. The body is two elements: the H1 claim (word-by-word
scroll paint from the `WORDS` array) and the mission `<p>` (fades in at the end
of the runway). The new narrative replaces the body across BOTH elements, so the
section's scroll choreography survives: the paint math reads `WORDS.length`
dynamically, so 20 words to 15 words works with no logic change, and the mission
fade is untouched. Replacing everything with one paragraph would have destroyed
the section's signature interaction. Header comment updated (20 to 15 words).

## Old text (verbatim, as rendered)

"I am a medical student and researcher in Indonesia. I study health questions
and build tools around them, through DaivanLabs. Founder, DaivanLabs. Code for
Cure: code that becomes healthcare tools, and connections that carry them
further, toward sustainable health systems for Indonesia."

## New text (verbatim)

Claim (H1, bold on "new knowledge" and "diverse experiences"):

"I am a clinical clerk in Indonesia, deeply passionate about new knowledge and
diverse experiences."

Mission (blue accent now on "CodeCureConnect:"):

"I aim to enhance health standards in Indonesia, bring about sustainable
change, and create lasting positive impacts. I founded DaivanLabs on
CodeCureConnect: code that becomes healthcare tools, and connections that carry
them further."

## Ide di balik teks baru (penjelasan untuk user)

Narasi ini punya alur tiga langkah, dan tiap langkah menjawab satu bagian dari
pesan user:

1. Siapa dia sekarang. Klaim dibuka dengan "clinical clerk", bukan lagi
"medical student", karena statusnya sudah berubah (koas). Ini pembaruan fakta,
bukan hiasan. Detail rotasi (bedah, sejak 5 Oktober 2026, FK UII) sengaja TIDAK
ditulis di sini: section ini dari awal tidak memuat detail itu, dan brief
melarang menambahkannya. Status koas juga sudah tercatat di tempat lain di situs
(`content.ts` profile), jadi tidak ada yang dikarang.
2. Apa yang menggerakkannya. "Deeply passionate about new knowledge and diverse
experiences" memakai kata-kata user sendiri. Dua frasa itu dibuat bold,
mengikuti pola lama yang selalu memboldkan frasa kunci klaim ("health
questions", "tools" dulu). Pesannya: rasa ingin tahu dan pengalaman beragam
adalah bahan bakar, bukan sekadar hobi.
3. Apa yang dituju, dan lewat mekanisme apa. Kalimat pertama misi memakai tiga
kata kerja user: enhance (standar kesehatan Indonesia), bring about
(perubahan berkelanjutan), create (dampak positif yang abadi). Kalimat kedua
memberi mekanismenya: DaivanLabs, yang dia dirikan, dan CodeCureConnect sebagai
SATU gagasan ciptaan, bukan tiga slogan. Definisi setelah titik dua memecahnya
dengan rapi: code menjadi healthcare tools (cure), connections membawa tools itu
lebih jauh (connect). Aksen biru yang dulu menandai "Code for Cure:" kini
menandai "CodeCureConnect:", jadi perangkat visualnya sama, isinya diperbarui.

Catatan soal "Code for Cure": tagline itu TIDAK hilang dari situs. Ia masih ada
di tempat lain (Hero pill, Services, Contact). Section ini memakai istilah baru
yang diminta user, tanpa menumpuk dua slogan dalam satu paragraf. Kata
"researcher" juga tidak hilang dari situs (masih ada di Research section dan
profile); ia hanya tidak dipakai di klaim baru ini karena brief menetapkan
identitasnya sebagai clerkship.

## Verification

- Old sentences: 0 hits in `Quote.tsx` (medical student, health questions,
  "Code for Cure:", sustainable health systems).
- New narrative: present (WORDS array + mission paragraph, rendered order
  verified by reading the file).
- Em dashes in diff: 0.
- Diff: `Quote.tsx` only, 20 insertions / 24 deletions.
- Build: PASS, vite built in 10.23s.
- Out of scope, left untouched: other "medical student" occurrences are
  different elements (Profile bio, SMART FK UII experience lines), not this
  block.
