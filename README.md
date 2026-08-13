<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🕷️ SPIDEY TRACKER - Live Sightings</title>
    <link href="https://fonts.googleapis.com/css2?family=Marvel:wght@400;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Marvel', sans-serif;
            overflow: hidden;
            position: relative;
        }

        /* Animated Web Background */
        .web-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 0, 0, 0.05) 0%, transparent 50%),
                linear-gradient(180deg, #0a0a0a 0%, #1a0000 100%);
            z-index: 0;
        }

        /* Animated Web Lines */
        .web-lines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            opacity: 0.15;
        }

        .web-line {
            position: absolute;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            height: 1px;
            animation: webSway 8s ease-in-out infinite;
        }

        @keyframes webSway {
            0%, 100% { transform: translateX(-100px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateX(100px) rotate(2deg); opacity: 0.8; }
        }

        /* Main Container */
        .tracker-container {
            position: relative;
            z-index: 1;
            width: 95%;
            max-width: 1200px;
            background: linear-gradient(145deg, rgba(20, 0, 0, 0.95), rgba(10, 0, 0, 0.98));
            border: 2px solid rgba(255, 0, 0, 0.3);
            border-radius: 30px;
            padding: 2rem;
            box-shadow: 
                0 0 60px rgba(255, 0, 0, 0.1),
                inset 0 0 60px rgba(255, 0, 0, 0.05);
            animation: containerPulse 4s ease-in-out infinite;
            backdrop-filter: blur(10px);
        }

        @keyframes containerPulse {
            0%, 100% { box-shadow: 0 0 60px rgba(255, 0, 0, 0.1), inset 0 0 60px rgba(255, 0, 0, 0.05); }
            50% { box-shadow: 0 0 80px rgba(255, 0, 0, 0.2), inset 0 0 80px rgba(255, 0, 0, 0.1); }
        }

        /* Header with Spidey swinging */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 1rem;
            border-bottom: 2px solid rgba(255, 0, 0, 0.2);
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .spidey-logo {
            font-size: 3rem;
            animation: spideySwing 2s ease-in-out infinite;
            display: inline-block;
        }

        @keyframes spideySwing {
            0%, 100% { transform: rotate(-10deg) scale(1); }
            50% { transform: rotate(10deg) scale(1.1); }
        }

        .title {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            font-size: 2.2rem;
            background: linear-gradient(135deg, #ff1744, #ff6b6b, #ff1744);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 3s ease-in-out infinite;
            letter-spacing: 2px;
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .status-badge {
            background: rgba(255, 0, 0, 0.15);
            border: 1px solid rgba(255, 0, 0, 0.3);
            padding: 0.3rem 1.2rem;
            border-radius: 50px;
            color: #ff6b6b;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.7rem;
            letter-spacing: 1px;
            animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }

        /* Map Area */
        .map-container {
            position: relative;
            width: 100%;
            height: 450px;
            background: 
                radial-gradient(ellipse at center, rgba(30, 0, 0, 0.8), rgba(0, 0, 0, 0.95)),
                url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwwLDAsMC4wNSkiLz48L3N2Zz4=');
            background-size: 60px 60px;
            border-radius: 20px;
            border: 1px solid rgba(255, 0, 0, 0.15);
            overflow: hidden;
            margin-bottom: 2rem;
        }

        /* City Grid Lines */
        .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(0deg, rgba(255, 0, 0, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 0, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
        }

        /* Spidey Sighting Markers */
        .sighting-marker {
            position: absolute;
            cursor: pointer;
            animation: markerPulse 2s ease-in-out infinite;
            transition: all 0.3s;
        }

        .sighting-marker:hover {
            transform: scale(1.3);
            z-index: 10;
        }

        @keyframes markerPulse {
            0%, 100% { transform: scale(0.9); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
        }

        .marker-dot {
            width: 16px;
            height: 16px;
            background: #ff1744;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 20px rgba(255, 23, 68, 0.6);
            position: relative;
        }

        .marker-dot::after {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 50%;
            border: 2px solid rgba(255, 23, 68, 0.3);
            animation: ringPulse 2s ease-in-out infinite;
        }

        @keyframes ringPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.5); opacity: 0; }
        }

        .marker-label {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 2px 10px;
            border-radius: 10px;
            font-size: 0.6rem;
            white-space: nowrap;
            border: 1px solid rgba(255, 0, 0, 0.3);
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 0.5px;
        }

        /* Web Swing Trail */
        .web-swing {
            position: absolute;
            width: 2px;
            height: 80px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
            transform-origin: top;
            animation: swingTrail 3s ease-in-out infinite;
        }

        @keyframes swingTrail {
            0%, 100% { transform: rotate(-20deg); opacity: 0.3; }
            50% { transform: rotate(20deg); opacity: 0.8; }
        }

        /* Info Cards */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .info-card {
            background: rgba(255, 0, 0, 0.05);
            border: 1px solid rgba(255, 0, 0, 0.15);
            border-radius: 15px;
            padding: 1.2rem;
            text-align: center;
            transition: all 0.3s;
        }

        .info-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 0, 0, 0.4);
            box-shadow: 0 10px 30px rgba(255, 0, 0, 0.1);
        }

        .info-card .number {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            font-weight: 900;
            color: #ff1744;
            display: block;
        }

        .info-card .label {
            color: #999;
            font-size: 0.8rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 0.3rem;
        }

        /* Controls */
        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            padding: 1rem;
            background: rgba(255, 0, 0, 0.05);
            border-radius: 20px;
            border: 1px solid rgba(255, 0, 0, 0.1);
        }

        .control-btn {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.2);
            color: #ff6b6b;
            padding: 0.6rem 1.8rem;
            border-radius: 50px;
            font-family: 'Marvel', sans-serif;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .control-btn:hover {
            background: rgba(255, 0, 0, 0.2);
            border-color: #ff1744;
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.2);
        }

        .control-btn.active {
            background: rgba(255, 0, 0, 0.3);
            border-color: #ff1744;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
        }

        /* Trailer Button */
        .trailer-section {
            text-align: center;
            margin: 2rem 0;
        }

        .trailer-btn {
            background: linear-gradient(135deg, #ff1744, #d50000);
            border: none;
            color: white;
            padding: 1rem 3rem;
            border-radius: 50px;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
        }

        .trailer-btn::before {
            content: '▶';
            margin-right: 10px;
        }

        .trailer-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 60px rgba(255, 23, 68, 0.4);
        }

        .trailer-btn::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(100%) rotate(45deg); }
        }

        /* Powered By */
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 0, 0, 0.1);
            flex-wrap: wrap;
            gap: 1rem;
        }

        .powered-by {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            color: #666;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }

        .powered-by .brand {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            color: #fff;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #fff, #999);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Spidey swinging across screen */
        .spidey-swinging {
            position: fixed;
            top: 10%;
            right: -100px;
            font-size: 4rem;
            animation: swingAcross 12s linear infinite;
            z-index: 2;
            pointer-events: none;
            opacity: 0.3;
        }

        @keyframes swingAcross {
            0% { transform: translateX(0) rotate(-10deg); }
            50% { transform: translateX(calc(-100vw - 200px)) rotate(10deg); }
            100% { transform: translateX(0) rotate(-10deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .tracker-container { padding: 1rem; }
            .title { font-size: 1.5rem; }
            .map-container { height: 300px; }
            .info-grid { grid-template-columns: 1fr 1fr; }
            .spidey-swinging { display: none; }
        }
    </style>
</head>
<body>

<!-- Background -->
<div class="web-bg"></div>

<!-- Web Lines -->
<div class="web-lines">
    <div class="web-line" style="top: 10%; left: 0; width: 30%; animation-delay: 0s;"></div>
    <div class="web-line" style="top: 30%; right: 0; width: 25%; animation-delay: 2s;"></div>
    <div class="web-line" style="top: 50%; left: 10%; width: 20%; animation-delay: 4s;"></div>
    <div class="web-line" style="top: 70%; right: 10%; width: 35%; animation-delay: 1s;"></div>
    <div class="web-line" style="top: 90%; left: 20%; width: 15%; animation-delay: 3s;"></div>
</div>

<!-- Swinging Spidey -->
<div class="spidey-swinging">🕷️</div>

<!-- Main Container -->
<div class="tracker-container">

    <!-- Header -->
    <div class="header">
        <div class="logo-section">
            <span class="spidey-logo">🕷️</span>
            <h1 class="title">SPIDEY TRACKER</h1>
        </div>
        <div class="status-badge">
            ● LIVE · 7 SIGHTINGS
        </div>
    </div>

    <!-- Welcome Text -->
    <div style="text-align: center; margin-bottom: 2rem; color: #888; font-size: 1.1rem; letter-spacing: 1px;">
        WELCOME TO THE SPIDEY TRACKER · INTERACT WITH THE MAP TO VIEW SPIDER-MAN SIGHTINGS ALL OVER THE WORLD.
    </div>

    <!-- Map -->
    <div class="map-container">
        <div class="grid-overlay"></div>

        <!-- Web Swing Effects -->
        <div class="web-swing" style="top: 20%; left: 15%; animation-delay: 0s;"></div>
        <div class="web-swing" style="top: 40%; right: 20%; animation-delay: 1.5s;"></div>
        <div class="web-swing" style="top: 60%; left: 40%; animation-delay: 3s;"></div>

        <!-- Sighting Markers -->
        <div class="sighting-marker" style="top: 25%; left: 30%;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ Times Square</div>
        </div>

        <div class="sighting-marker" style="top: 45%; right: 25%; animation-delay: 0.5s;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ London Bridge</div>
        </div>

        <div class="sighting-marker" style="bottom: 30%; left: 20%; animation-delay: 1s;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ Tokyo Tower</div>
        </div>

        <div class="sighting-marker" style="bottom: 20%; right: 30%; animation-delay: 1.5s;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ Sydney Opera</div>
        </div>

        <div class="sighting-marker" style="top: 15%; right: 40%; animation-delay: 2s;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ Paris</div>
        </div>

        <div class="sighting-marker" style="bottom: 40%; left: 50%; animation-delay: 2.5s;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ Cairo</div>
        </div>

        <div class="sighting-marker" style="top: 50%; left: 10%; animation-delay: 3s;">
            <div class="marker-dot"></div>
            <div class="marker-label">🕸️ Dubai</div>
        </div>
    </div>

    <!-- Stats -->
    <div class="info-grid">
        <div class="info-card">
            <span class="number">7</span>
            <span class="label">Sightings Today</span>
        </div>
        <div class="info-card">
            <span class="number">14</span>
            <span class="label">Active Trackers</span>
        </div>
        <div class="info-card">
            <span class="number">23</span>
            <span class="label">Cities Covered</span>
        </div>
        <div class="info-card">
            <span class="number">98%</span>
            <span class="label">Accuracy Rate</span>
        </div>
    </div>

    <!-- Controls -->
    <div class="controls">
        <button class="control-btn active">
            <span>🔴</span> TRACKING ON
        </button>
        <button class="control-btn">
            <span>🔊</span> SOUND ON
        </button>
        <button class="control-btn">
            <span>🔇</span> SOUND OFF
        </button>
        <button class="control-btn">
            <span>🌐</span> SELECT SETTING
        </button>
    </div>

    <!-- Trailer -->
    <div class="trailer-section">
        <button class="trailer-btn" onclick="alert('🕷️ Watch the trailer! Coming soon...')">
            WATCH TRAILER
        </button>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="powered-by">
            <span>Powered by</span>
            <span class="brand">SAMSUNG</span>
            <span>Galaxy</span>
        </div>
        <div style="color: #444; font-size: 0.7rem; letter-spacing: 1px;">
            🕸️ SPIDEY TRACKER v3.0 · 2026
        </div>
    </div>

</div>

<script>
    // Interactive Markers - Click to show sighting info
    document.querySelectorAll('.sighting-marker').forEach(marker => {
        marker.addEventListener('click', function(e) {
            e.stopPropagation();
            const label = this.querySelector('.marker-label');
            const originalText = label.textContent;
            label.textContent = '🕷️ CONFIRMED!';
            label.style.color = '#ff1744';
            label.style.fontWeight = 'bold';
            
            // Animate
            this.style.transform = 'scale(1.5)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);

            setTimeout(() => {
                label.textContent = originalText;
                label.style.color = '#fff';
                label.style.fontWeight = 'normal';
            }, 2000);
        });
    });

    // Control Buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.textContent.includes('SOUND')) {
                if (this.textContent.includes('ON')) {
                    this.innerHTML = '<span>🔇</span> SOUND OFF';
                } else {
                    this.innerHTML = '<span>🔊</span> SOUND ON';
                }
            }
        });
    });

    // Animated web lines - random movement
    setInterval(() => {
        document.querySelectorAll('.web-line').forEach(line => {
            const randomY = Math.random() * 100;
            line.style.top = randomY + '%';
            line.style.width = (Math.random() * 30 + 10) + '%';
        });
    }, 5000);
</script>

</body>
</html>
