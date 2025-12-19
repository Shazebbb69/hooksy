// client/src/pages/Patterns.jsx
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { supabase } from '../utils/supabaseClient'

const DEFAULT_PATTERNS = [
  {
    id: 'granny-square',
    name: 'Granny Square',
    difficulty: 'Beginner',
    description: 'Perfect for beginners. A classic crochet square that can be used for blankets, coasters, and more.',
    image: '🧶',
    color: 'from-purple-100 to-purple-50',
    borderColor: 'border-purple-300',
    instructions: `# GRANNY SQUARE CROCHET PATTERN

## Finished Size
Approximately 4" x 4" (10cm x 10cm)

## Materials
- Yarn: Worsted weight, any color (approx 50 yards)
- Crochet Hook: Size H/8 (5mm)
- Scissors
- Yarn needle

## Abbreviations
- ch = chain
- sc = single crochet
- dc = double crochet
- sl st = slip stitch
- sp = space

## Pattern Instructions

Step 1: Create Magic Ring
Create a magic ring (or ch 4, sl st to form ring). This is your center.

Step 2: First Round
1. Ch 3 (counts as first dc)
2. 2 dc in ring
3. Ch 2 (this creates corner space)
4. *3 dc in ring, ch 2* - repeat 3 more times (4 sides total)
5. Sl st to top of beginning ch 3
6. Fasten off

Step 3: Second Round
1. Join yarn to any corner ch-2 space
2. Ch 3, 2 dc in same space (corner)
3. Ch 1, 3 dc in same space (creates corner group)
4. *Ch 1, 3 dc in next ch-2 space, ch 1, 3 dc in same space* - repeat 3 more times
5. Ch 1, sl st to top of beginning ch 3
6. Fasten off

## Pro Tips
- Keep tension consistent for even squares
- Use stitch markers to mark corners
- Block squares before joining for perfect alignment
- Practice on light-colored yarn to see stitches clearly

## Joining Multiple Squares
Use whip stitch or sl st to join multiple squares into blankets or larger projects. Align corners carefully for a professional finish.`
  },
  {
    id: 'mikasa-scarf',
    name: 'Mikasa Scarf',
    difficulty: 'Intermediate',
    description: 'Warm and cozy scarf pattern inspired by anime. Great for cold winters.',
    image: '🧣',
    color: 'from-blue-100 to-blue-50',
    borderColor: 'border-blue-300',
    instructions: `# MIKASA SCARF CROCHET PATTERN

## Finished Size
Approximately 6" wide x 60" long (15cm x 152cm)

## Materials
- Yarn: Worsted weight, gray or dark color (approx 600 yards)
- Crochet Hook: Size H/8 (5mm)
- Scissors
- Yarn needle

## Abbreviations
- ch = chain
- sc = single crochet
- hdc = half double crochet
- dc = double crochet
- sl st = slip stitch
- st(s) = stitch(es)
- sk = skip

## Gauge
16 sts and 10 rows = 4" (10cm) in pattern

## Pattern Notes
- Pattern is worked in rows
- Ch 3 at beginning of row counts as first dc
- This scarf uses a textured stitch for warmth

## Pattern Instructions

Foundation:
Ch 25

Row 1:
1. Dc in 4th ch from hook (skip 3 ch)
2. Dc in each ch across (22 dc)
3. Ch 3, turn

Rows 2-180:
1. Sk first st
2. Dc in each st across
3. Dc in top of ch 3
4. Ch 3, turn

Continue until scarf measures approximately 60" or desired length.

## Finishing
1. Cut yarn leaving 6" tail
2. Pull tail through last loop
3. Weave in all ends with yarn needle
4. Block lightly if desired

## Variations
- Use thicker yarn for quicker project (adjust hook size accordingly)
- Add fringe to ends for decorative look (cut 8" strands)
- Use striped yarn for color variation
- Make wider or narrower by adjusting foundation chain count

## Care Instructions
- Machine wash on gentle cycle, cold water
- Lay flat to dry
- Do not bleach or iron`
  },
  {
    id: 'bandana',
    name: 'Bandana',
    difficulty: 'Beginner',
    description: 'Stylish triangular bandana that\'s perfect for spring and summer projects.',
    image: '🎀',
    color: 'from-pink-100 to-pink-50',
    borderColor: 'border-pink-300',
    instructions: `# TRIANGULAR BANDANA CROCHET PATTERN

## Finished Size
Adjustable - approximately 18-22" across top edge

## Materials
- Yarn: Worsted weight, any color (approx 300-400 yards)
- Crochet Hook: Size H/8 (5mm)
- Scissors
- Yarn needle

## Abbreviations
- ch = chain
- dc = double crochet
- sc = single crochet
- sl st = slip stitch
- st = stitch
- sp = space

## Pattern Notes
- Ch 3 at beginning of each row counts as first dc
- Bandana is worked from center point outward
- Adjust number of rows for desired size

## Pattern Instructions

Foundation:
Create a Magic Ring

Row 1:
Ch 3 (counts as first dc), work 2 dc into ring, ch 3, work 3 more dc into ring. Close your magic ring tightly.

Row 2:
Turn your work. Ch 3, work 2 dc into first st, ch 1, work 3 dc in top corner ch space, ch 3, work 3 dc in same top corner ch space, ch 1, work 3 dc in last st of the row.

Row 3:
Turn your work. Ch 3, work 2 dc into first st, ch 1, work 3 dc in ch space, ch 1, work 3 dc in top corner ch space, ch 3, work 3 dc in same top corner ch space, ch 1, work 3 dc into ch space, ch 1, work 3 dc into last st of the row.

Row 4:
Turn your work. Ch 3, work 2 dc into first st, ch 1, work 3 dc into ch space, ch 1, work 3 dc into ch space, ch 1, work 3 dc into top corner ch space, ch 3, work 3 dc into same top corner ch space, ch 1, work 3 dc into ch space, ch 1, work 3 dc into ch space, ch 1, work 3 dc into last st of the row.

Rows 5-15:
Repeat the following pattern:
- Turn your work
- Ch 3, work 2 dc into first st (ch 3 counts as 1 of the 3 dc)
- Work 3 dc in every ch space with a ch 1 between each dc cluster
- At top corner: work 3 dc in corner ch space, ch 3, work 3 dc in same corner ch space
- Continue 3 dc clusters with ch 1 between across
- Work 3 dc into last st of the row

Continue for 15 rows total or adjust for desired head size.

## Adding Ties

First Tie:
Ch 46. Sl st in 2nd ch from hook, sl st into each ch until end of chain.

Bottom Edge:
Sc evenly across the bottom edge of bandana (no set number needed, just enough to reach opposite edge smoothly).

Second Tie:
Ch 46. Sl st in 2nd ch from hook, sl st into each ch until end of chain. Work 1 sl st into main body of bandana to secure the tie.

## Finishing
1. Weave in all ends
2. Block if desired for crisp edges
3. Try on and adjust ties as needed

## Size Adjustments
- Small (child): 12-13 rows
- Medium (teen/adult): 15 rows
- Large: 17-18 rows

## Styling Tips
- Tie around head as traditional bandana
- Wear as neckerchief
- Use as hair accessory
- Perfect for festivals and summer outings`
  },
  {
    id: 'octopus-keychain',
    name: 'Octopus Keychain',
    difficulty: 'Intermediate',
    description: 'Cute and adorable amigurumi octopus keychain. Perfect gift idea!',
    image: '🐙',
    color: 'from-orange-100 to-orange-50',
    borderColor: 'border-orange-300',
    instructions: `# AMIGURUMI OCTOPUS KEYCHAIN CROCHET PATTERN

## Finished Size
Approximately 3" tall (7.5cm) without tentacles

## Materials
- Yarn: Worsted weight, main color (approx 100 yards)
- Yarn: Small amount for eyes/details
- Crochet Hook: Size H/8 (5mm)
- Fiberfill stuffing
- Scissors
- Yarn needle
- Stitch markers
- Optional: 8mm safety eyes or black embroidery floss
- Keychain ring (1")

## Abbreviations
- ch = chain
- sc = single crochet
- sl st = slip stitch
- st(s) = stitch(es)
- inc = increase (2 sc in same st)
- dec = decrease (sc 2 together)
- rnd = round

## Pattern Notes
- Work in continuous rounds unless noted
- Use stitch marker to mark beginning of round
- Stuff firmly as you go for best results
- Do not join or turn unless specified

## Pattern Instructions

### HEAD (Magic Ring Method)

Rnd 1: 6 sc in magic ring (6 sts)

Rnd 2: Inc in each st around (12 sts)

Rnd 3: *Sc 1, inc* repeat around (18 sts)

Rnds 4-8: Sc in each st around (18 sts) - work 5 rounds total

Rnd 9: *Sc 1, dec* repeat around (12 sts)

⚠️ Before closing: Add fiberfill stuffing firmly

Rnd 10: Dec around (6 sts)

Fasten off leaving 8" tail for sewing. Use yarn needle to close remaining hole.

### TENTACLES (Make 8)

Method:
Ch 12
Sc in 2nd ch from hook
Sc in each ch back to beginning (11 sc)
Fasten off, leaving 4" tail for attaching

Repeat to create 8 tentacles total.

### EYES

Option 1: Safety Eyes
- Insert safety eyes at Rnd 4, spaced 4-5 sts apart
- Secure backs inside before stuffing completely

Option 2: Embroidered Eyes
- Use white yarn to embroider two circles (5-6 wraps each)
- Use black yarn for pupils in center
- Add white highlight dot for sparkle effect

### FACIAL FEATURES

Smile:
Use black embroidery floss or yarn to stitch a curved smile between eyes.

Optional Rosy Cheeks:
Use pink embroidery floss to add small circles on each side of face.

## Assembly

Step 1: Arrange Tentacles
Position 8 tentacles evenly around bottom opening of head (about 1 stitch apart).

Step 2: Attach Tentacles
Using yarn needle and tails, sew each tentacle securely to base of head. Weave through multiple stitches for strength.

Step 3: Add Keychain Ring
Thread keychain ring through top center of head or through one tentacle.

Step 4: Finishing
- Weave in all remaining ends
- Optional: Seal tentacle tips with clear nail polish for glossy finish
- Trim any excess yarn

## Variations
- Use variegated yarn for colorful effect
- Make tentacles longer (ch 15-18 instead of 12)
- Add small beads as eyes
- Create in rainbow colors for variety
- Make larger version for plushie (double all stitches)

## Color Suggestions
- Classic: Purple or pink
- Ocean: Teal or turquoise
- Fun: Bright orange or yellow
- Pastel: Lavender or mint green

## Care Instructions
- Spot clean only
- Do not machine wash
- Keep away from water if using safety eyes
- Store in cool, dry place`
  }
]

export default function Patterns() {
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [showPDF, setShowPDF] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [userPatterns, setUserPatterns] = useState([])
  const [featuredPatterns, setFeaturedPatterns] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [importData, setImportData] = useState({
    name: '',
    difficulty: 'Beginner',
    description: '',
    file: null
  })

  useEffect(() => {
    fetchUserPatterns()
    fetchFeaturedPatterns()
  }, [])

  const fetchFeaturedPatterns = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_patterns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const dbPatterns = data.map(p => ({
        id: p.pattern_id,
        name: p.name,
        difficulty: p.difficulty,
        description: p.description,
        image: p.image,
        color: p.color,
        borderColor: p.border_color,
        instructions: p.instructions
      }))

      setFeaturedPatterns([...DEFAULT_PATTERNS, ...dbPatterns])
    } catch (err) {
      console.error('Error fetching featured patterns:', err)
      setFeaturedPatterns(DEFAULT_PATTERNS)
    }
  }

  const fetchUserPatterns = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Please log in to view your patterns')
        return
      }

      const { data, error } = await supabase
        .from('user_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserPatterns(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching patterns:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setImportData(prev => ({ ...prev, file }))
      setError(null)
    }
  }

  const handleImportPattern = async (e) => {
    e.preventDefault()
    setError(null)

    if (!importData.name.trim()) {
      setError('Please enter a pattern name')
      return
    }

    if (!importData.file) {
      setError('Please select a PDF file')
      return
    }

    setUploading(true)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('Please log in to upload patterns')
        setUploading(false)
        return
      }

      const fileName = `${user.id}/${Date.now()}-${importData.file.name}`
      const { error: uploadError } = await supabase.storage
        .from('pattern-pdfs')
        .upload(fileName, importData.file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('pattern-pdfs')
        .getPublicUrl(fileName)

      const { data: insertData, error: dbError } = await supabase
        .from('user_patterns')
        .insert({
          user_id: user.id,
          name: importData.name.trim(),
          difficulty: importData.difficulty,
          description: importData.description.trim() || null,
          pdf_url: publicUrl,
          pdf_size: importData.file.size
        })
        .select()

      if (dbError) throw dbError

      setImportData({ name: '', description: '', difficulty: 'Beginner', file: null })
      setShowImportModal(false)
      await fetchUserPatterns()
    } catch (err) {
      console.error('Error importing pattern:', err)
      setError(err.message || 'Failed to import pattern')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePattern = async (patternId) => {
    if (!confirm('Are you sure you want to delete this pattern?')) return

    try {
      const pattern = userPatterns.find(p => p.id === patternId)
      if (!pattern) return

      if (pattern.pdf_url) {
        const filePath = pattern.pdf_url.split('/storage/v1/object/public/pattern-pdfs/')[1]
        if (filePath) {
          await supabase.storage
            .from('pattern-pdfs')
            .remove([filePath])
        }
      }

      const { error } = await supabase
        .from('user_patterns')
        .delete()
        .eq('id', patternId)

      if (error) throw error
      await fetchUserPatterns()
    } catch (err) {
      console.error('Error deleting pattern:', err)
      setError(err.message)
    }
  }

  const generateStyledHTML = (pattern) => {
    const lines = pattern.instructions.split('\n')
    let html = ''

    lines.forEach((line) => {
      // Remove markdown asterisks and format properly
      let cleanLine = line
        .replace(/\*\*/g, '') // Remove all ** markers
        .replace(/\*/g, '')   // Remove all * markers
        .trim()

      if (cleanLine === '') {
        html += '<div style="height: 10px;"></div>'
        return
      }

      // Main title (# )
      if (line.startsWith('# ')) {
        const text = cleanLine.replace(/^#\s+/, '')
        html += `<h1 style="font-size: 28px; font-weight: 900; color: #1f2937; margin: 30px 0 20px 0;">${text}</h1>`
      }
      // Section headers (## )
      else if (line.startsWith('## ')) {
        const text = cleanLine.replace(/^##\s+/, '')
        html += `<h2 style="font-size: 18px; font-weight: 700; color: #9d72b3; border-left: 4px solid #d946ef; padding-left: 12px; margin: 25px 0 12px 0;">${text}</h2>`
      }
      // Subsection headers (### )
      else if (line.startsWith('### ')) {
        const text = cleanLine.replace(/^###\s+/, '')
        html += `<h3 style="font-size: 15px; font-weight: 600; color: #4b5563; margin: 15px 0 8px 0;">${text}</h3>`
      }
      // Bullet lists (- )
      else if (line.startsWith('- ')) {
        const text = cleanLine.replace(/^-\s+/, '')
        html += `<div style="margin-left: 20px; margin-bottom: 8px;"><span style="color: #d946ef; font-weight: bold;">•</span> <span style="color: #374151;">${text}</span></div>`
      }
      // Numbered lists (1. 2. etc)
      else if (line.match(/^\d+\./)) {
        const number = line.match(/^\d+\./)[0]
        const text = cleanLine.substring(cleanLine.indexOf('.') + 1).trim()
        html += `<div style="margin-left: 20px; margin-bottom: 8px;"><span style="color: #9d72b3; font-weight: bold;">${number}</span> <span style="color: #374151;">${text}</span></div>`
      }
      // Warning/Note boxes (⚠️ or lines that look like steps)
      else if (cleanLine.match(/^(Step|Rnd|Row|Round)\s*\d+/i)) {
        html += `<div style="font-weight: 700; color: #1f2937; margin: 15px 0 10px 0; font-size: 14px; background: linear-gradient(135deg, #d946ef10, #a855f710); padding: 8px 12px; border-radius: 6px; border-left: 3px solid #d946ef;">${cleanLine}</div>`
      }
      // Regular paragraphs
      else {
        html += `<p style="color: #4b5563; line-height: 1.7; margin: 8px 0; font-size: 14px;">${cleanLine}</p>`
      }
    })

    return html
  }

  const handleViewPDF = (pattern, isUserPattern = false) => {
    setSelectedPattern({ ...pattern, isUserPattern })
    setShowPDF(true)
  }

  const handleDownloadPDF = (pattern, isUserPattern = false) => {
    if (isUserPattern) {
      const link = document.createElement('a')
      link.href = pattern.pdf_url
      link.download = `${pattern.name}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const styledHTML = generateStyledHTML(pattern)
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pattern.name} - Crochet Pattern</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Playfair+Display:wght@700;900&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Poppins', sans-serif;
              background: linear-gradient(135deg, #f3e9f8 0%, #faf8ff 100%);
              padding: 40px 20px;
              color: #374151;
            }

            .container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              padding: 50px;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(157, 114, 179, 0.15);
              border-top: 8px solid #d946ef;
            }

            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 3px solid #e9d5ff;
            }

            .emoji {
              font-size: 64px;
              margin-bottom: 15px;
              display: block;
              filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
            }

            .title {
              font-family: 'Playfair Display', serif;
              font-size: 40px;
              font-weight: 900;
              background: linear-gradient(135deg, #9d72b3 0%, #d946ef 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 15px;
              letter-spacing: -1px;
            }

            .difficulty {
              display: inline-block;
              background: linear-gradient(135deg, #d946ef, #a855f7);
              color: white;
              padding: 10px 24px;
              border-radius: 25px;
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              box-shadow: 0 4px 15px rgba(217, 70, 239, 0.3);
            }

            .content {
              margin-top: 30px;
            }

            h1 {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 900;
              color: #1f2937;
              margin: 30px 0 20px 0;
            }

            h2 {
              font-size: 18px;
              font-weight: 700;
              color: #9d72b3;
              border-left: 4px solid #d946ef;
              padding-left: 12px;
              margin: 25px 0 12px 0;
            }

            h3 {
              font-size: 15px;
              font-weight: 600;
              color: #4b5563;
              margin: 15px 0 8px 0;
            }

            p {
              color: #4b5563;
              line-height: 1.8;
              margin: 8px 0;
              font-size: 14px;
            }

            .footer {
              margin-top: 50px;
              padding-top: 30px;
              border-top: 3px solid #e9d5ff;
              text-align: center;
            }

            .footer-emoji {
              font-size: 24px;
              margin-bottom: 10px;
            }

            .footer-text {
              color: #9d72b3;
              font-weight: 700;
              font-size: 14px;
              margin-bottom: 5px;
            }

            .footer-subtext {
              color: #a78baf;
              font-size: 12px;
            }

            @media print {
              body {
                background: white;
                padding: 0;
              }
              .container {
                box-shadow: none;
                border: none;
              }
            }

            @page {
              margin: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="emoji">${pattern.image}</span>
              <h1 class="title">${pattern.name}</h1>
              <span class="difficulty">${pattern.difficulty}</span>
            </div>

            <div class="content">
              ${styledHTML}
            </div>

            <div class="footer">
              <div class="footer-emoji">🧶</div>
              <div class="footer-text">Created with Hooksy - Crochet Patterns</div>
              <div class="footer-subtext">Happy Crocheting!</div>
            </div>
          </div>
        </body>
        </html>
      `
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      
      iframe.onload = function() {
        iframe.contentWindow.document.open()
        iframe.contentWindow.document.write(htmlContent)
        iframe.contentWindow.document.close()
        iframe.contentWindow.print()
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)
      }
      
      iframe.src = 'about:blank'
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />

        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10">
          <section>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h1 className="text-4xl font-bold text-purple-900">
                Crochet Patterns
              </h1>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Import Pattern
              </button>
            </div>
            <p className="text-purple-600 font-medium">
              Browse our collection and import your own crochet patterns
            </p>
          </section>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl">
              {error}
            </div>
          )}

          {userPatterns.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-purple-900 mb-6">My Patterns</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="bg-white rounded-2xl border-2 border-purple-200/50 p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <h3 className="text-xl font-bold text-purple-900 mb-2">
                      📄 {pattern.name}
                    </h3>
                    <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
                      {pattern.difficulty}
                    </p>
                    <p className="text-purple-800 text-sm leading-relaxed mb-5">
                      {pattern.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPDF(pattern, true)}
                        className="flex-1 px-4 py-2.5 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors shadow-sm border border-purple-200"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(pattern, true)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                      >
                        ⬇️ Download
                      </button>
                      <button
                        onClick={() => handleDeletePattern(pattern.id)}
                        className="px-4 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Featured Patterns</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`bg-gradient-to-br ${pattern.color} rounded-2xl border-2 ${pattern.borderColor} p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{pattern.image}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-purple-900">
                        {pattern.name}
                      </h3>
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                        {pattern.difficulty}
                      </p>
                    </div>
                  </div>

                  <p className="text-purple-800 text-sm leading-relaxed mb-5">
                    {pattern.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewPDF(pattern)}
                      className="flex-1 px-4 py-2.5 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors shadow-sm border border-purple-200"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(pattern)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {showImportModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowImportModal(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border-2 border-purple-200 bg-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-purple-900 mb-2">
                Import Pattern
              </h2>
              <p className="text-purple-600 mb-6">
                Add your own PDF patterns to your collection
              </p>

              {error && (
                <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleImportPattern} className="space-y-4">
                <label className="flex flex-col w-full">
                  <p className="text-purple-900 text-sm font-semibold pb-2">
                    Pattern Name *
                  </p>
                  <input
                    type="text"
                    value={importData.name}
                    onChange={(e) => setImportData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., My Beautiful Shawl"
                    className="rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                  />
                </label>

                <label className="flex flex-col w-full">
                  <p className="text-purple-900 text-sm font-semibold pb-2">
                    Difficulty Level
                  </p>
                  <select
                    value={importData.difficulty}
                    onChange={(e) => setImportData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>

                <label className="flex flex-col w-full">
                  <p className="text-purple-900 text-sm font-semibold pb-2">
                    Description
                  </p>
                  <textarea
                    value={importData.description}
                    onChange={(e) => setImportData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the pattern"
                    rows="3"
                    className="rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition resize-none"
                  />
                </label>

                <label className="flex flex-col w-full">
                  <p className="text-purple-900 text-sm font-semibold pb-2">
                    PDF File *
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="block w-full rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/30 px-4 py-6 text-center cursor-pointer hover:bg-purple-100/30 transition"
                    >
                      <div className="text-2xl mb-2">📄</div>
                      <p className="text-sm font-semibold text-purple-900">
                        {importData.file ? importData.file.name : 'Click to select PDF'}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">Max 10MB</p>
                    </label>
                  </div>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="flex-1 px-6 py-2.5 border-2 border-purple-200 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-700 transition-all"
                  >
                    {uploading ? 'Uploading...' : 'Import Pattern'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPDF && selectedPattern && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowPDF(false)}
          >
            <div
              className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-purple-200/50 bg-gradient-to-r from-purple-50 to-white">
                <h2 className="text-2xl font-bold text-purple-900">
                  {selectedPattern.image || '📄'} {selectedPattern.name}
                </h2>
                <button
                  onClick={() => setShowPDF(false)}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-gradient-to-br from-purple-50/30 to-white">
                {selectedPattern.isUserPattern ? (
                  <iframe
                    src={selectedPattern.pdf_url}
                    className="w-full h-full border-none"
                    title="PDF Viewer"
                  />
                ) : (
                  <div className="p-12">
                    <div className="bg-white rounded-2xl p-12 shadow-xl border-t-8 border-purple-500">
                      <div style={{ textAlign: 'center', marginBottom: '40px', paddingBottom: '30px', borderBottom: '3px solid #e9d5ff' }}>
                        <div style={{ fontSize: '64px', marginBottom: '15px', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}>
                          {selectedPattern.image}
                        </div>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', fontWeight: '900', background: 'linear-gradient(135deg, #9d72b3 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '15px', letterSpacing: '-1px' }}>
                          {selectedPattern.name}
                        </h1>
                        <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #d946ef, #a855f7)', color: 'white', padding: '10px 24px', borderRadius: '25px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', boxShadow: '0 4px 15px rgba(217, 70, 239, 0.3)' }}>
                          {selectedPattern.difficulty}
                        </div>
                      </div>

                      <div dangerouslySetInnerHTML={{ __html: generateStyledHTML(selectedPattern) }} />

                      <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '3px solid #e9d5ff', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>🧶</div>
                        <div style={{ color: '#9d72b3', fontWeight: '700', fontSize: '14px', marginBottom: '5px' }}>Created with Hooksy - Crochet Patterns</div>
                        <div style={{ color: '#a78baf', fontSize: '12px' }}>Happy Crocheting!</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-purple-200/50 bg-gradient-to-r from-purple-50 to-white">
                <button
                  onClick={() => setShowPDF(false)}
                  className="flex-1 px-6 py-2.5 border-2 border-purple-200 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadPDF(selectedPattern, selectedPattern.isUserPattern)
                    setShowPDF(false)
                  }}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                >
                  ⬇️ Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
