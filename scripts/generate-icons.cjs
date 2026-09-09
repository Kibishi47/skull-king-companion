const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const publicDir = path.resolve(__dirname, '../public');
const svgPath = path.join(publicDir, 'favicon.svg');

// Required PWA icon targets:
// - apple-touch-icon.png (180x180, iOS Safari requires opaque background)
// - icon-192.png (192x192, Android standard & maskable)
// - icon-512.png (512x512, High definition standard & maskable)
//
// Style requirements:
// - Rich aged dark leather background: #18100c
// - Subtle warm gold/amber radial glow behind the emblem: from #3d2817 in center to #120a06 on edges
// - Emblem occupying ~75-80% of the surface (scale: ~0.78, pad: ~11%)
const targets = [
  { file: 'icon-512.png', size: 512, scale: 0.78 },
  { file: 'icon-192.png', size: 192, scale: 0.78 },
  { file: 'apple-touch-icon.png', size: 180, scale: 0.78 },
];

targets.forEach(({ file, size, scale }) => {
  const tmpPath = `/tmp/raw_${file}`;
  const outPath = path.join(publicDir, file);
  const emblemSize = Math.round(size * scale);
  const pad = Math.round((size - emblemSize) / 2);

  const jxa = `
ObjC.import('Cocoa');

var svgImage = $.NSImage.alloc.initWithContentsOfFile('${svgPath}');
var img = $.NSImage.alloc.initWithSize($.NSMakeSize(${size}, ${size}));
img.lockFocus;

// 1. Fond cuir vieilli très sombre (#18100c)
var baseBg = $.NSColor.colorWithSRGBRedGreenBlueAlpha(24/255, 16/255, 12/255, 1.0);
baseBg.setFill;
$.NSRectFill($.NSMakeRect(0, 0, ${size}, ${size}));

// 2. Halo lumineux radial doré/ambre au centre (#3d2817 vers #120a06)
var centerColor = $.NSColor.colorWithSRGBRedGreenBlueAlpha(61/255, 40/255, 23/255, 0.95);
var edgeColor = $.NSColor.colorWithSRGBRedGreenBlueAlpha(18/255, 10/255, 6/255, 0.0);
var gradient = $.NSGradient.alloc.initWithStartingColorEndingColor(centerColor, edgeColor);
var centerPoint = $.NSMakePoint(${size / 2}, ${size / 2});
gradient.drawFromCenterRadiusToCenterRadiusOptions(
  centerPoint, 0,
  centerPoint, ${size * 0.55},
  $.NSGradientDrawsAfterEndingLocation
);

// 3. Dessin de l'emblème SVG à ~78% de la surface pour une lisibilité optimale
svgImage.drawInRect($.NSMakeRect(${pad}, ${pad}, ${emblemSize}, ${emblemSize}));

img.unlockFocus;

var tiff = img.TIFFRepresentation;
var rep = $.NSBitmapImageRep.imageRepsWithData(tiff).objectAtIndex(0);
var png = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $.NSDictionary.dictionary);
png.writeToFileAtomically('${tmpPath}', true);
`;

  fs.writeFileSync('/tmp/render_icon.js', jxa);
  execSync('/usr/bin/osascript -l JavaScript /tmp/render_icon.js');
  // Assure les dimensions exactes en pixels
  execSync(`sips -z ${size} ${size} "${tmpPath}" --out "${outPath}"`);
  console.log(`✓ Generated ${file} (${size}x${size}, scale ${Math.round(scale * 100)}%)`);
});
