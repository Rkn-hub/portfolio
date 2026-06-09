import sys

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix hero-magazine-title centering
old_hero = """.hero-magazine-title {
            font-size: 15vw;
            font-weight: 900;
            line-height: 0.8;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            white-space: nowrap;
            pointer-events: none;
            letter-spacing: -0.05em;
            text-transform: uppercase;
        }"""
new_hero = """.hero-magazine-title {
            font-size: 15vw;
            font-weight: 900;
            line-height: 0.8;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            white-space: nowrap;
            pointer-events: none;
            letter-spacing: -0.05em;
            text-transform: uppercase;
            width: 100%;
            text-align: center;
        }"""
content = content.replace(old_hero, new_hero)

# 2. Touch fixes from previous agent
old_touch = """            /* Disable hover-flip on touch — use tap toggle instead */
            .project-card .group-hover\:\\[transform\:rotateY\\(180deg\\)\\] {
                transform: none !important;
            }"""
new_touch = """            /* Disable hover-flip on touch — use tap toggle instead, but allow .flipped */
            .project-card .project-card-inner:not(.flipped) {
                transform: none !important;
            }

            /* Disable quadrant hover grid on touch — it blocks ParticleText touch events */
            #about .grid-cols-2.grid-rows-2 {
                pointer-events: none !important;
                display: none !important;
            }

            /* Let the ParticleText interaction layer receive touch events */
            #magnetic-text {
                pointer-events: auto !important;
                position: relative;
                z-index: 40;
            }"""
content = content.replace(old_touch, new_touch)

# 3. Add Custom Card at the end
custom_card = """

/* Custom Card Flip */
.custom-card {
  width: 100%;
  min-height: 180px;
  aspect-ratio: 3 / 4;
  background: rgb(15, 15, 15);
  transition: all 0.4s;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.705);
  font-size: 1.25rem;
  font-weight: 900;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}

.custom-card:hover {
  border-radius: 15px;
  cursor: pointer;
  transform: scale(1.03);
  box-shadow: 0px 0px 20px 8px rgba(0, 0, 0, 0.9);
  background: rgb(0, 0, 0);
  z-index: 10;
  border: 1px solid rgba(255,255,255,0.3);
}

.first-content {
  height: 100%;
  width: 100%;
  transition: all 0.4s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  border-radius: inherit;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem;
  text-align: center;
}

.custom-card:hover .first-content {
  height: 0px;
  opacity: 0;
}

.second-content {
  height: 0%;
  width: 100%;
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
  transition: all 0.4s;
  font-size: 0px;
  transform: rotate(90deg) scale(-1);
  position: absolute;
  top: 0;
  left: 0;
  padding: 1.2rem;
  text-align: center;
}

.custom-card:hover .second-content {
  opacity: 1;
  height: 100%;
  font-size: 0.82rem;
  transform: rotate(0deg);
}

.custom-card .first-content span.proj-title {
  color: white;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  font-size: clamp(0.75rem, 1.4vw, 1.1rem);
  font-weight: 900;
  line-height: 1.2;
}

.custom-card .second-content span.proj-desc {
  color: white;
  font-weight: 700;
  line-height: 1.4;
}
"""

content += custom_card

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)
