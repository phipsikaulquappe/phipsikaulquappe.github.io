---
layout: default
title: Recorded Drawings
year: 2026
date: 2026-03-22
hide_project_navigation: true
thumbnail: /images/drawings/recorded-drawings.jpg
recorded_drawings:
  - file: /assets/recorded-drawing-data/drawing-01.json
    author: 
  - file: /assets/recorded-drawing-data/drawing-02.json
    author: 
  - file: /assets/recorded-drawing-data/drawing-03.json
    author: 
  # - file: /assets/recorded-drawing-data/drawing-04.json
  #   author: 
  - file: /assets/recorded-drawing-data/drawing-05.json
    author:
  - file: /assets/recorded-drawing-data/drawing-06.json
    author: 
  # - file: /assets/recorded-drawing-data/drawing-07.json
  #   author: 
  # - file: /assets/recorded-drawing-data/drawing-08.json
  #   author: 
  - file: /assets/recorded-drawing-data/drawing-09.json
    author: 
    
    # file: /assets/recorded-drawing-data/drawing-09.json
    # author: "Anonymous"
    # file: /assets/recorded-drawing-data/drawing-10.json
    # author: "Anonymous"
  
---

<h1 class="project-title">
    <em>{{ page.title }}</em><span class="year">, {{ page.year }}</span>
</h1>

<div class="drawing-replay">
    <canvas
        id="replayCanvas"
        data-drawings='{{ page.recorded_drawings | jsonify }}'>
    </canvas>
</div>
<div class="drawing-ui">
    <div class="drawing-controls">
        <button class="drawing-nav drawing-nav-left" id="drawingNavLeft" aria-label="Previous drawing">
            ←
        </button>
        <p id="drawingCounter" class="drawing-counter"></p>
        <button class="drawing-nav drawing-nav-right" id="drawingNavRight" aria-label="Next drawing">
            →
        </button>
    </div>
    <div id="drawingAuthor" class="drawing-author"></div>
    <button class="drawing-sound" id="drawingSoundToggle" type="button" aria-pressed="false" aria-label="Sound einschalten" title="Sound an/aus (M)">
        <!-- Lautsprecher durchgestrichen (Sound aus) -->
        <svg class="icon-off" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z"/>
            <path d="M17 9l5 6M22 9l-5 6"/>
        </svg>
        <!-- Lautsprecher mit Wellen (Sound an) -->
        <svg class="icon-on" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z"/>
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>
        </svg>
    </button>
</div>