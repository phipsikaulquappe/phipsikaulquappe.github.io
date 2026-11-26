document.addEventListener("DOMContentLoaded", function () {

    const layout = document.querySelector(".layout");
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.querySelector(".sidebar");

    /* =========================
       SIDEBAR TOGGLE MOBILE
    ========================== */

    if (toggleBtn && layout) {
        toggleBtn.addEventListener("click", function () {
            layout.classList.toggle("sidebar-open");
        });
    }

    /* =========================
       SIDEBAR CLOSE ON OUTSIDE CLICK
    ========================== */

    document.addEventListener("click", function (e) {

        if (!layout || !layout.classList.contains("sidebar-open")) return;

        if (toggleBtn && toggleBtn.contains(e.target)) return;
        if (sidebar && sidebar.contains(e.target)) return;

        layout.classList.remove("sidebar-open");

    });

    /* =========================
      LOAD SAVED THEME
    ========================== */

    const themes = ["theme-gray", "theme-green", "theme-purple"];
    const savedTheme = localStorage.getItem("siteTheme");
    
    // Alle Theme-Klassen entfernen
    document.body.classList.remove(...themes);

    // Falls gespeichert → anwenden
    if (savedTheme && themes.includes(savedTheme)) {
        document.body.classList.add(savedTheme);
    } else {
        // Default: Gray
        document.body.classList.add("theme-gray");
    }

    /* =========================
       THEME TOGGLE
    ========================== */

    const themeBtn = document.getElementById("themeToggle");

    if (themeBtn) {

        themeBtn.addEventListener("click", function () {

            let currentIndex = themes.findIndex(t =>
                document.body.classList.contains(t)
            );

            if (currentIndex !== -1) {
                document.body.classList.remove(themes[currentIndex]);
            }

            let nextIndex = (currentIndex + 1) % themes.length;
            document.body.classList.add(themes[nextIndex]);
            localStorage.setItem("siteTheme", themes[nextIndex]);

        });
    }

     /* =========================
        SIDEBAR → PREVIEW HOVER LINK
        ========================== */

    const sidebarLinks = document.querySelectorAll('.sidebar a[data-project]');

    sidebarLinks.forEach(link => {

        link.addEventListener('mouseenter', () => {
            const target = link.dataset.project;

            document.querySelectorAll('.preview-item').forEach(item => {
                item.classList.remove('sidebar-hover');

                if (item.dataset.project === target) {
                    item.classList.add('sidebar-hover');
                }
            });
        });

    });
    
        sidebarLinks.forEach(link => {
        link.setAttribute('aria-haspopup', 'true');
        link.addEventListener('click', (e) => {
            // Toggle Sidebar
        });
    });

    document.querySelector('.sidebar').addEventListener('mouseleave', () => {
        document.querySelectorAll('.preview-item')
            .forEach(item => item.classList.remove('sidebar-hover'));
    });

    /* =========================
    IMAGE FADE-IN ON LOAD
    ========================= */

    const gridImages = document.querySelectorAll('.media-grid img');

    gridImages.forEach((img) => {
        if (img.complete) {
            img.classList.add('is-loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('is-loaded');
            });
        }
    });

    /* =========================
    LIGHTBOX (EDITORIAL MODE)
    ========================== */

    const images = document.querySelectorAll('.media-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const btnPrev = document.getElementById('slideshowNavLeft');
    const btnNext = document.getElementById('slideshowNavRight');
    const btnClose = document.getElementById('slideshowClose');

    let currentIndex = 0;

    if (images.length) {

        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            updateImage();
        }

        function closeLightbox() {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }

        function updateImage() {
            lightboxImage.src = images[currentIndex].src;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        }

        btnNext.addEventListener('click', showNext);
        btnPrev.addEventListener('click', showPrev);
        btnClose.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {

            // Nur reagieren wenn Lightbox offen ist
            if (lightbox.classList.contains('hidden')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            }

            if (e.key === 'ArrowRight') {
                showNext();
            }

            if (e.key === 'ArrowLeft') {
                showPrev();
            }

        });

        // Klick-Zonen links / rechts
        lightbox.addEventListener('click', (e) => {

            const isMobile = window.matchMedia("(pointer: coarse)").matches;

            // Wenn Button oder Button-Inhalt geklickt wurde → nichts hier machen
            if (e.target.closest('button')) return;

            if (isMobile) {
                const clickY = e.clientY;
                const screenHeight = window.innerHeight;
                const clickX = e.clientX;
                const screenWidth = window.innerWidth;

                // Oberes oder unteres Viertel → schließen
                if (clickY < screenHeight / 4 || clickY > screenHeight / 4 * 3) {
                    closeLightbox();
                    return;
                }

                // Mittlerer Bereich → links/rechts navigieren
                if (clickX > screenWidth / 2) {
                    showNext();
                } else {
                    showPrev();
                }
                return;
            }

            // DESKTOP → Links / Rechts Navigation
            const clickX = e.clientX;
            const screenWidth = window.innerWidth;

            if (clickX > screenWidth / 2) {
                showNext();
            } else {
                showPrev();
            }

        });

    }
    /* =========================
        ABOUT DRAWING
    ========================= */

    const aboutCanvas = document.getElementById('aboutCanvas');

    let currentColor = '#009dff'; // default

    if (aboutCanvas) {
        const ctx = aboutCanvas.getContext('2d');
        const aboutArea = document.querySelector('.about-draw-area');

        let lastX = null;
        let lastY = null;
        let pauseDrawing = false;
        let recordingLocked = false;

        let recordingStart = null;
        let recordedSegments = [];

        function resizeCanvas() {
            const rect = aboutArea.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            aboutCanvas.width = rect.width * dpr;
            aboutCanvas.height = rect.height * dpr;

            aboutCanvas.style.width = rect.width + 'px';
            aboutCanvas.style.height = rect.height + 'px';

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            ctx.lineWidth = 1.3;
            ctx.strokeStyle = currentColor;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }

        function startRecording() {
            recordingStart = performance.now();
            recordedSegments = [];
            recordingLocked = false;
        }

        function downloadDrawingJSON() {
            if (!recordedSegments.length) return;

            const json = JSON.stringify(recordedSegments, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const now = new Date();
            const filename = `about-drawing-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}.json`;

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        startRecording();

        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';

            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }

            return color;
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'a') currentColor = '#efebc1';
            if (e.key === 'b') currentColor = '#7f7ff3';
            if (e.key === 'c') currentColor = '#4b794b';
            if (e.key === 'd') currentColor = '#0d0167';
            if (e.key === 'e') currentColor = '#ff8000';
            if (e.key === 'f') currentColor = '#fbe606';
            if (e.key === 'g') currentColor = '#009dff';
            if (e.key === 'h') currentColor = '#00fb00';
            if (e.key === 'i') currentColor = '#2b1e8e';
            if (e.key === 'j') currentColor = '#52310f';
            if (e.key === 'k') currentColor = '#fff36e';
            if (e.key === 'l') currentColor = '#ff0099';
            if (e.key === 'm') currentColor = '#491850';
            if (e.key === 'n') currentColor = '#ff0000';
            if (e.key === 'o') currentColor = '#caca0b';
            if (e.key === 'p') currentColor = '#6efff8';
            if (e.key === 'q') currentColor = '#bf87ff';
            if (e.key === 's') currentColor = '#b700ff';
            if (e.key === 't') currentColor = '#ff85ef';
            if (e.key === 'v') currentColor = '#ff8000';
            if (e.key === 'w') currentColor = '#bbff6e';
            if (e.key === 'x') currentColor = '#405a65';
            if (e.key === 'y') currentColor = '#63a263';
            if (e.key === 'z') currentColor = '#000000';
            if (e.key === '1') currentColor = '#444444';

            // RANDOM COLOR
            if (e.key === 'r') {
                currentColor = getRandomColor();
            }
        });

        // document.addEventListener('keyup', () => {
        //     currentColor = '#b3ff00'; // zurück zu default
        // });

        document.addEventListener('mousemove', (e) => {
            if (pauseDrawing || recordingLocked) {
                lastX = null;
                lastY = null;
                return;
            }

            const rect = aboutArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
                lastX = null;
                lastY = null;
                return;
            }

            if (lastX === null || lastY === null) {
                lastX = x;
                lastY = y;
                return;
            }

            // 👉 HIER DIE FARBE SETZEN
            ctx.strokeStyle = currentColor;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            recordedSegments.push({
                type: 'line',
                x1: lastX,
                y1: lastY,
                x2: x,
                y2: y,
                t: Math.round(performance.now() - recordingStart),
                color: currentColor
            });

            lastX = x;
            lastY = y;
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!recordedSegments.length) return;
                if (recordingLocked) return;

                downloadDrawingJSON();
                recordingLocked = true;
                lastX = null;
                lastY = null;
            }
        });

        const aboutLinks = document.querySelectorAll('.about-draw-area a');

        aboutLinks.forEach((link) => {
            link.addEventListener('mouseenter', () => {
                pauseDrawing = true;
            });

            link.addEventListener('mouseleave', () => {
                pauseDrawing = false;
                lastX = null;
                lastY = null;
            });
        });
    }

    /* =========================
         DRAWING REPLAY
    ========================= */

    const drawingAuthor = document.getElementById('drawingAuthor');
    const replayCanvas = document.getElementById('replayCanvas');

    if (replayCanvas) {
        const drawings = JSON.parse(replayCanvas.dataset.drawings || '[]');
        const ctx = replayCanvas.getContext('2d');

        const btnPrevDrawing = document.getElementById('drawingNavLeft');
        const btnNextDrawing = document.getElementById('drawingNavRight');
        const drawingCounter = document.getElementById('drawingCounter');

        let currentDrawingIndex = 0;
        let replayData = [];
        let currentIndex = 0;
        let startReplayTime = null;
        let replayAnimationId = null;

        let canvasWidth = 0;
        let canvasHeight = 0;

        /* ---------------------------------
           DRAWING SOUND (Web Audio API)
           Höhe (y)        → Tonhöhe
           Position (x)    → Stereo-Panorama
           Zeichentempo    → Lautstärke + Helligkeit
           Pausen          → Stille
           dunkle Farben   → tieferer, weicherer Klang
        ---------------------------------- */

        // false = gleitende Tonhöhe (Theremin), true = Stufen (Pentatonik)
        const SOUND_QUANTIZE = false;
        // Lücke zwischen zwei Segmenten (ms), ab der es als Pause gilt
        const SOUND_PAUSE_MS = 150;
        const PENTATONIC = [0, 2, 4, 7, 9];

        const soundBtn = document.getElementById('drawingSoundToggle');

        let soundOn = false;
        let audioCtx = null;
        let audioOut = null;
        let audioDelay = null;
        let audioPlayback = null;

        function ensureAudio() {
            if (audioCtx) return audioCtx;

            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;

            audioCtx = new AC();

            audioOut = audioCtx.createGain();
            audioOut.gain.value = 0.8;
            audioOut.connect(audioCtx.destination);

            // dezentes Echo
            audioDelay = audioCtx.createDelay(1);
            audioDelay.delayTime.value = 0.28;
            const feedback = audioCtx.createGain();
            feedback.gain.value = 0.35;
            const wet = audioCtx.createGain();
            wet.gain.value = 0.3;
            audioDelay.connect(feedback);
            feedback.connect(audioDelay);
            audioDelay.connect(wet);
            wet.connect(audioOut);

            return audioCtx;
        }

        function noteFrequency(ny) {
            // ny: 0 = oben, 1 = unten → drei Oktaven, oben = hoch
            let midi = 48 + (1 - ny) * 36;

            if (SOUND_QUANTIZE) {
                const octave = Math.floor((midi - 48) / 12);
                const rest = midi - 48 - octave * 12;
                let best = 0;
                let bestDist = 99;

                PENTATONIC.concat([12]).forEach(p => {
                    const dist = Math.abs(p - rest);
                    if (dist < bestDist) {
                        bestDist = dist;
                        best = p;
                    }
                });

                midi = 48 + octave * 12 + best;
            }

            return 440 * Math.pow(2, (midi - 69) / 12);
        }

        function colorLuma(hex) {
            const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
            if (!m) return 0.5;

            const n = parseInt(m[1], 16);
            const r = (n >> 16) & 255;
            const g = (n >> 8) & 255;
            const b = n & 255;

            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        }

        function stopDrawingSound() {
            if (!audioPlayback || !audioCtx) {
                audioPlayback = null;
                return;
            }

            const p = audioPlayback;
            audioPlayback = null;

            const now = audioCtx.currentTime;
            p.out.gain.cancelScheduledValues(now);
            p.out.gain.setTargetAtTime(0, now, 0.015);

            p.voices.forEach(v => {
                try { v.osc.stop(now + 0.12); } catch (err) { /* schon gestoppt */ }
            });

            setTimeout(() => {
                try { p.out.disconnect(); } catch (err) { /* egal */ }
            }, 300);
        }

        // Plant den Ton für die Zeichnung ab offsetMs (so bleibt er synchron,
        // auch wenn der Ton erst mitten im Replay eingeschaltet wird)
        function startDrawingSound(data, offsetMs) {
            stopDrawingSound();

            if (!soundOn || !data || !data.length) return;

            const A = ensureAudio();
            if (!A) return;
            if (A.state === 'suspended') A.resume();

            const bounds = getBounds(data);
            const w = Math.max(bounds.maxX - bounds.minX, 1);
            const h = Math.max(bounds.maxY - bounds.minY, 1);
            const refScale = 800 / Math.max(w, h);

            // Signalkette dieser Wiedergabe
            const out = A.createGain();
            out.gain.value = 1;
            out.connect(audioOut);
            out.connect(audioDelay);

            const pan = A.createStereoPanner();
            pan.connect(out);

            const filter = A.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 2;
            filter.connect(pan);

            const types = ['sine', 'triangle'];
            const voices = types.map(type => {
                const osc = A.createOscillator();
                const gain = A.createGain();
                osc.type = type;
                gain.gain.value = 0;
                osc.connect(gain);
                gain.connect(filter);
                osc.start(A.currentTime);
                return { osc, gain };
            });

            const st = A.currentTime + 0.05;
            let prevT = null;
            let lastT = null;

            data.forEach(s => {
                if (s.type !== 'line' || s.t < offsetMs) return;

                const T = st + (s.t - offsetMs) / 1000;
                const dt = prevT === null ? Infinity : s.t - prevT;
                const isPause = dt > SOUND_PAUSE_MS;
                const Ts = isPause ? T - 0.03 : st + (prevT - offsetMs) / 1000;

                const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1) * refScale;
                const speed = len / (isPause ? 16 : Math.max(dt, 1));
                const vol = Math.min(0.32, 0.04 + speed * 0.22);
                const cutoff = 500 + Math.min(speed, 4) * 1800;

                const ny1 = (s.y1 - bounds.minY) / h;
                const ny2 = (s.y2 - bounds.minY) / h;
                const f1 = noteFrequency(ny1);
                const f2 = noteFrequency(ny2);
                const px1 = Math.max(-1, Math.min(1, ((s.x1 - bounds.minX) / w) * 1.8 - 0.9));
                const px2 = Math.max(-1, Math.min(1, ((s.x2 - bounds.minX) / w) * 1.8 - 0.9));

                if (isPause) {
                    if (prevT !== null) {
                        const fadeAt = st + (prevT - offsetMs) / 1000 + 0.06;
                        voices.forEach(v => v.gain.gain.linearRampToValueAtTime(0, fadeAt));
                    }
                    voices.forEach((v, k) => {
                        v.gain.gain.setValueAtTime(0, Ts);
                        v.osc.frequency.setValueAtTime(k ? f1 / 2 : f1, Ts);
                    });
                    pan.pan.setValueAtTime(px1, Ts);
                    filter.frequency.setValueAtTime(cutoff, Ts);
                }

                // dunkle Farben → zweite Stimme (tiefer, weicher)
                const active = colorLuma(s.color) < 0.4 ? 1 : 0;

                voices.forEach((v, k) => {
                    const target = k === active ? (k ? vol * 1.1 : vol) : 0;
                    v.gain.gain.linearRampToValueAtTime(target, T);

                    const f = k ? f2 / 2 : f2;
                    if (SOUND_QUANTIZE) {
                        v.osc.frequency.setTargetAtTime(f, Ts, 0.02);
                    } else {
                        v.osc.frequency.linearRampToValueAtTime(f, T);
                    }
                });

                pan.pan.linearRampToValueAtTime(px2, T);
                filter.frequency.linearRampToValueAtTime(cutoff, T);

                prevT = s.t;
                lastT = T;
            });

            if (lastT === null) {
                // nichts mehr zu spielen (Replay schon vorbei)
                voices.forEach(v => { try { v.osc.stop(); } catch (err) { /* egal */ } });
                out.disconnect();
                return;
            }

            voices.forEach(v => {
                v.gain.gain.linearRampToValueAtTime(0, lastT + 0.4);
                v.osc.stop(lastT + 1.5);
            });

            audioPlayback = { out, voices };
        }

        function currentReplayElapsed() {
            if (startReplayTime === null) return 0;
            return Math.max(0, performance.now() - startReplayTime);
        }

        function setSound(on) {
            soundOn = on;

            if (soundBtn) {
                soundBtn.classList.toggle('is-on', on);
                soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
                soundBtn.setAttribute('aria-label', on ? 'Sound ausschalten' : 'Sound einschalten');
            }

            if (on) {
                // Klick = Nutzeraktion → AudioContext darf starten
                ensureAudio();
                startDrawingSound(replayData, currentReplayElapsed());
            } else {
                stopDrawingSound();
            }
        }

        if (soundBtn) {
            soundBtn.addEventListener('click', () => setSound(!soundOn));
        }

        function resizeReplayCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const width = replayCanvas.clientWidth;
            const height = replayCanvas.clientHeight;

            canvasWidth = width;
            canvasHeight = height;

            replayCanvas.width = width * dpr;
            replayCanvas.height = height * dpr;

            replayCanvas.style.width = width + 'px';
            replayCanvas.style.height = height + 'px';

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            ctx.lineWidth = 1.3;
            ctx.strokeStyle = currentColor;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }

        function clearReplayCanvas() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        }

        function getBounds(data) {
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            data.forEach(segment => {
                if (segment.type !== 'line') return;

                minX = Math.min(minX, segment.x1, segment.x2);
                minY = Math.min(minY, segment.y1, segment.y2);
                maxX = Math.max(maxX, segment.x1, segment.x2);
                maxY = Math.max(maxY, segment.y1, segment.y2);
            });

            if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
                return { minX: 0, minY: 0, maxX: canvasWidth, maxY: canvasHeight };
            }

            return { minX, minY, maxX, maxY };
        }

        function drawSegment(segment, transform) {
            if (segment.type !== 'line') return;

            ctx.strokeStyle = segment.color || '#b3ff00';

            const x1 = (segment.x1 - transform.minX) * transform.scale + transform.offsetX;
            const y1 = (segment.y1 - transform.minY) * transform.scale + transform.offsetY;
            const x2 = (segment.x2 - transform.minX) * transform.scale + transform.offsetX;
            const y2 = (segment.y2 - transform.minY) * transform.scale + transform.offsetY;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        function updateDrawingCounter() {
            if (!drawingCounter || !drawings.length) return;

            // Zählung beginnt bei der höchsten Zahl (neueste Zeichnung)
            const displayNumber = currentDrawingIndex + 1;

            // Maximalwert für die Zählung
            const maxNumber = drawings.length;

            // DisplayNumber begrenzen (falls mehr als maxNumber gezeichnet wird)
            if (displayNumber > maxNumber) {
                drawingCounter.textContent = maxNumber;
            } else {
                drawingCounter.textContent = displayNumber;
            }
        }
        

        function getTransform(data) {
            const bounds = getBounds(data);
            const drawingWidth = Math.max(bounds.maxX - bounds.minX, 1);
            const drawingHeight = Math.max(bounds.maxY - bounds.minY, 1);

            const padding = 20;
            const availableWidth = Math.max(canvasWidth - padding * 2, 1);
            const availableHeight = Math.max(canvasHeight - padding * 2, 1);

            const scale = Math.min(
                availableWidth / drawingWidth,
                availableHeight / drawingHeight
            );

            const scaledWidth = drawingWidth * scale;
            const scaledHeight = drawingHeight * scale;

            const offsetX = (canvasWidth - scaledWidth) / 2;
            const offsetY = (canvasHeight - scaledHeight) / 2;

            return {
                minX: bounds.minX,
                minY: bounds.minY,
                scale,
                offsetX,
                offsetY
            };
        }

        function animateReplay(timestamp) {
            if (!startReplayTime) {
                startReplayTime = timestamp;
            }

            const elapsed = timestamp - startReplayTime;
            const transform = getTransform(replayData);

            while (
                currentIndex < replayData.length &&
                replayData[currentIndex].t <= elapsed
            ) {
                drawSegment(replayData[currentIndex], transform);
                currentIndex++;
            }

            if (currentIndex < replayData.length) {
                replayAnimationId = requestAnimationFrame(animateReplay);
            }
        }

        function startReplay() {
            currentIndex = 0;
            startReplayTime = null;
            clearReplayCanvas();

            if (replayAnimationId) {
                cancelAnimationFrame(replayAnimationId);
            }

            replayAnimationId = requestAnimationFrame(animateReplay);
            updateDrawingCounter();

            // Ton passend zum Replay-Start (nur wenn Sound an ist)
            startDrawingSound(replayData, 0);
        }

        function loadDrawing(index) {
            if (!drawings.length) return;

            // Ton der vorherigen Zeichnung sofort beenden
            stopDrawingSound();

            if (index < 0) {
                currentDrawingIndex = drawings.length - 1;
            } else if (index >= drawings.length) {
                currentDrawingIndex = 0;
            } else {
                currentDrawingIndex = index;
            }
            updateDrawingCounter();
            
            fetch(drawings[currentDrawingIndex].file)
                .then(response => response.json())
                .then(data => {
                    replayData = data;
                    startReplay();
                    updateAuthor(); 
                })

                .catch(error => {
                    console.error('Replay JSON konnte nicht geladen werden:', error);
                });

            function updateAuthor() {
                if (!drawingAuthor) return;

                const author = drawings[currentDrawingIndex].author;

                drawingAuthor.textContent = author ? author : '';
            }
        }

        function showNextDrawing() {
            loadDrawing(currentDrawingIndex - 1);
        }

        function showPrevDrawing() {
            loadDrawing(currentDrawingIndex + 1);
        }

        resizeReplayCanvas();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeReplayCanvas();

                /* NUR neu zeichnen, nicht Replay neu starten */
                if (replayData.length) {
                    const alreadyDrawn = replayData.slice(0, currentIndex);
                    clearReplayCanvas();
                    const transform = getTransform(replayData);
                    alreadyDrawn.forEach(segment => drawSegment(segment, transform));
                }
            }, 150);
        });

        if (btnNextDrawing) {
            btnNextDrawing.addEventListener('click', showNextDrawing);
        }

        if (btnPrevDrawing) {
            btnPrevDrawing.addEventListener('click', showPrevDrawing);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                showNextDrawing();
            }

            if (e.key === 'ArrowLeft') {
                showPrevDrawing();
            }

            // M = Sound an/aus
            if (e.key === 'm' || e.key === 'M') {
                setSound(!soundOn);
            }
        });

        loadDrawing(drawings.length - 1);
    }
});