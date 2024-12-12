async function setup() {
    const patchExportURL = "export/patch.export.json";
    const keyToNoteMap = {
    'a': 40, // Key 'A' plays MIDI note 40
    'b': 42, // Key 'B' plays MIDI note 42
    'c': 44, // Key 'C' plays MIDI note 44
    'd': 46, // Key 'D' plays MIDI note 46
    'e': 48, // Key 'E' plays MIDI note 48
    'f': 50, // Key 'F' plays MIDI note 50
    'g': 52, // Key 'G' plays MIDI note 52
    'h': 54, // Key 'H' plays MIDI note 54
    'i': 56, // Key 'I' plays MIDI note 56
    'j': 58, // Key 'J' plays MIDI note 58
    'k': 60, // Key 'K' plays MIDI note 60
    'l': 62, // Key 'L' plays MIDI note 62
    'm': 64, // Key 'M' plays MIDI note 64
    'n': 66, // Key 'N' plays MIDI note 66
    'o': 68, // Key 'O' plays MIDI note 68
    'p': 70, // Key 'P' plays MIDI note 70
    'q': 72, // Key 'Q' plays MIDI note 72
    'r': 74, // Key 'R' plays MIDI note 74
    's': 76, // Key 'S' plays MIDI note 76
    't': 78, // Key 'T' plays MIDI note 78
    'u': 80, // Key 'U' plays MIDI note 80
    'v': 82, // Key 'V' plays MIDI note 82
    'w': 84, // Key 'W' plays MIDI note 84
    'x': 86, // Key 'X' plays MIDI note 86
    'y': 88, // Key 'Y' plays MIDI note 88
    'z': 90  // Key 'Z' plays MIDI note 90
    };

document.getElementById('toggle-particles').addEventListener('change', (e) => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(p => {
        p.style.display = e.target.checked ? 'block' : 'none';
    });
});

document.getElementById('toggle-gradient').addEventListener('change', (e) => {
    if (e.target.checked) {
        updateBackgroundColor(); // Start background animation
    } else {
        document.body.style.background = ''; // Reset background
    }
});

document.getElementById('toggle-visualizer').addEventListener('change', (e) => {
    const visualizer = document.getElementById('visualizer');
    if (e.target.checked) {
        visualizer.style.display = 'block';
        updateVisualizer(); // Restart visualizer
    } else {
        visualizer.style.display = 'none';
    }
});

    // Create AudioContext
    const WAContext = window.AudioContext || window.webkitAudioContext;
    const context = new WAContext();

    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);
    // Connect the analyser node to the audio output
const analyser = context.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

outputNode.connect(analyser); // Connect analyser between outputNode and destination
analyser.connect(context.destination); // Connect analyser to destination

function createParticles() {
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        document.body.appendChild(particle);

        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;

        const animationDuration = Math.random() * 10 + 5;
        particle.style.animationDuration = `${animationDuration}s`;
        document.body.addEventListener('mousemove', (e) => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(p => {
                const dx = e.clientX - p.offsetLeft;
                const dy = e.clientY - p.offsetTop;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    p.style.transform = `translate(${dx / 5}px, ${dy / 5}px)`;
                } else {
                    p.style.transform = '';
                }
            });
        });
        
    }
}
createParticles();
createVisualizer();
function createVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.id = 'visualizer';
    visualizer.style.position = 'absolute';
    visualizer.style.right = '0'; // Align to the right
    visualizer.style.top = '0'; // Align to the top
    visualizer.style.height = '100%';
    visualizer.style.width = '25%'; // Take 25% of screen width
    visualizer.style.display = 'flex';
    visualizer.style.alignItems = 'flex-end';
    visualizer.style.justifyContent = 'center';
    visualizer.style.background = 'rgba(0, 0, 0, 0.4)'; // Optional: Add a translucent background
    document.body.appendChild(visualizer);

    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.flex = '1';
        bar.style.margin = '2px';
        bar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        visualizer.appendChild(bar);
    }

    function updateVisualizer() {
        analyser.getByteFrequencyData(dataArray);

        const bars = visualizer.querySelectorAll('.bar');
        bars.forEach((bar, i) => {
            const barHeight = (dataArray[i] / 255) * visualizer.offsetHeight;
            bar.style.height = `${barHeight}px`;
            bar.style.backgroundColor = `rgba(${barHeight}, ${255 - barHeight}, 255, 0.8)`; // Color based on amplitude
        });

        requestAnimationFrame(updateVisualizer);
    }

    updateVisualizer();
}

// Function to update the background based on sound
function updateBackgroundColor() {
    analyser.getByteFrequencyData(dataArray);

    // Example: Average the first few frequency bands
    let avg = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;

    // Map the average amplitude to RGB values
    let r = Math.min(255, avg * 2);
    let g = Math.min(255, 255 - avg);
    let b = Math.min(255, 128 + avg / 2);

    // Use a dynamic gradient for the background
    document.body.style.background = `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}), rgb(${b}, ${r}, ${g}))`;

     // Add a sound-reactive glow to the container
     document.getElementById('rnbo-root').style.boxShadow = `0 0 ${avg * 5}px rgba(${r}, ${g}, ${b}, 0.8)`;
     
    // Continuously update
    requestAnimationFrame(updateBackgroundColor);
}

function createVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.id = 'visualizer';
    document.body.appendChild(visualizer);

    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        visualizer.appendChild(bar);
    }

    function updateVisualizer() {
        analyser.getByteFrequencyData(dataArray);
        const visualizer = document.getElementById("visualizer");
    
        visualizer.innerHTML = ''; // Clear previous bars
        const barCount = 32;
        const barWidth = visualizer.offsetWidth / barCount;
    
        for (let i = 0; i < barCount; i++) {
            const barHeight = (dataArray[i] / 255) * visualizer.offsetHeight;
            const bar = document.createElement('div');
            bar.style.width = `${barWidth - 2}px`;
            bar.style.height = `${barHeight}px`;
            bar.style.background = `rgba(${255 - barHeight}, ${barHeight}, 255, 0.8)`;
            bar.style.display = 'inline-block';
            bar.style.marginRight = '2px';
            visualizer.appendChild(bar);
        }
    
        requestAnimationFrame(updateVisualizer);
    }
    
    
    updateVisualizer();
}
createVisualizer();


// Start the background update loop
updateBackgroundColor();

    // Fetch the exported patcher
    let response, patcher;
    try {
        response = await fetch(patchExportURL);
        patcher = await response.json();
    
        if (!window.RNBO) {
            // Load RNBO script dynamically
            // Note that you can skip this by knowing the RNBO version of your patch
            // beforehand and just include it using a <script> tag
            await loadRNBOScript(patcher.desc.meta.rnboversion);
        }

    } catch (err) {
        const errorContext = {
            error: err
        };
        if (response && (response.status >= 300 || response.status < 200)) {
            errorContext.header = `Couldn't load patcher export bundle`,
            errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
            ` trying to load "${patchExportURL}". If that doesn't` + 
            ` match the name of the file you exported from RNBO, modify` + 
            ` patchExportURL in app.js.`;
        }
        if (typeof guardrails === "function") {
            guardrails(errorContext);
        } else {
            throw err;
        }
        return;
    }
    
    // (Optional) Fetch the dependencies
    let dependencies = [];
    try {
        const dependenciesResponse = await fetch("export/dependencies.json");
        dependencies = await dependenciesResponse.json();

        // Prepend "export" to any file dependenciies
        dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
    } catch (e) {}

    // Create the device
    let device;
    try {
        device = await RNBO.createDevice({ context, patcher });
    } catch (err) {
        if (typeof guardrails === "function") {
            guardrails({ error: err });
        } else {
            throw err;
        }
        return;
    }

    document.addEventListener("keydown", (event) => {
        const note = keyToNoteMap[event.key.toLowerCase()];
        if (note) {
            playNoteOn(note, device);
        }
    });
    
    document.addEventListener("keyup", (event) => {
        const note = keyToNoteMap[event.key.toLowerCase()];
        if (note) {
            playNoteOff(note, device);
        }
    });
    
    // (Optional) Load the samples
    if (dependencies.length)
        await device.loadDataBufferDependencies(dependencies);

    // Connect the device to the web audio graph
    device.node.connect(outputNode);

    // (Optional) Automatically create sliders for the device parameters
    makeSliders(device);

    // (Optional) Connect MIDI inputs
    makeMIDIKeyboard(device);

    document.body.onclick = () => {
        context.resume();
    }

    // Skip if you're not using guardrails.js
    if (typeof guardrails === "function")
        guardrails();
}

function loadRNBOScript(version) {
    return new Promise((resolve, reject) => {
        if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
            throw new Error("Patcher exported with a Debug Version!\nPlease specify the correct RNBO version to use in the code.");
        }
        const el = document.createElement("script");
        el.src = "https://c74-public.nyc3.digitaloceanspaces.com/rnbo/" + encodeURIComponent(version) + "/rnbo.min.js";
        el.onload = resolve;
        el.onerror = function(err) {
            console.log(err);
            reject(new Error("Failed to load rnbo.js v" + version));
        };
        document.body.append(el);
    });
}

function makeSliders(device) {
    let pdiv = document.getElementById("rnbo-parameter-sliders");
    let noParamLabel = document.getElementById("no-param-label");
    if (noParamLabel && device.numParameters > 0) pdiv.removeChild(noParamLabel);

    // This will allow us to ignore parameter update events while dragging the slider.
    let isDraggingSlider = false;
    let uiElements = {};

    device.parameters.forEach(param => {
        // Subpatchers also have params. If we want to expose top-level
        // params only, the best way to determine if a parameter is top level
        // or not is to exclude parameters with a '/' in them.
        // You can uncomment the following line if you don't want to include subpatcher params
        
        //if (param.id.includes("/")) return;

        // Create a label, an input slider and a value display
        let label = document.createElement("label");
        let slider = document.createElement("input");
        let text = document.createElement("input");
        let sliderContainer = document.createElement("div");
        sliderContainer.appendChild(label);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(text);

        // Add a name for the label
        label.setAttribute("name", param.name);
        label.setAttribute("for", param.name);
        label.setAttribute("class", "param-label");
        label.textContent = `${param.name}: `;

        // Make each slider reflect its parameter
        slider.setAttribute("type", "range");
        slider.setAttribute("class", "param-slider");
        slider.setAttribute("id", param.id);
        slider.setAttribute("name", param.name);
        slider.setAttribute("min", param.min);
        slider.setAttribute("max", param.max);
        if (param.steps > 1) {
            slider.setAttribute("step", (param.max - param.min) / (param.steps - 1));
        } else {
            slider.setAttribute("step", (param.max - param.min) / 1000.0);
        }
        slider.setAttribute("value", param.value);

        // Make a settable text input display for the value
        text.setAttribute("value", param.value.toFixed(1));
        text.setAttribute("type", "text");

        // Make each slider control its parameter
        slider.addEventListener("pointerdown", () => {
            isDraggingSlider = true;
        });
        slider.addEventListener("pointerup", () => {
            isDraggingSlider = false;
            slider.value = param.value;
            text.value = param.value.toFixed(1);
        });
        slider.addEventListener("input", () => {
            let value = Number.parseFloat(slider.value);
            param.value = value;
        });

        // Make the text box input control the parameter value as well
        text.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                let newValue = Number.parseFloat(text.value);
                if (isNaN(newValue)) {
                    text.value = param.value;
                } else {
                    newValue = Math.min(newValue, param.max);
                    newValue = Math.max(newValue, param.min);
                    text.value = newValue;
                    param.value = newValue;
                }
            }
        });

        // Store the slider and text by name so we can access them later
        uiElements[param.id] = { slider, text };

        // Add the slider element
        pdiv.appendChild(sliderContainer);
    });

    // Listen to parameter changes from the device
    device.parameterChangeEvent.subscribe(param => {
        if (!isDraggingSlider)
            uiElements[param.id].slider.value = param.value;
        uiElements[param.id].text.value = param.value.toFixed(1);
    });
}

function makeMIDIKeyboard(device) {
    let mdiv = document.getElementById("rnbo-clickable-keyboard");
    if (device.numMIDIInputPorts === 0) return;

    mdiv.removeChild(document.getElementById("no-midi-label"));

    const midiNotes = [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90];
    midiNotes.forEach(note => {
        const key = document.createElement("div");
        const label = document.createElement("p");
        label.textContent = note;
        key.appendChild(label);
        key.addEventListener("pointerdown", () => {
            let midiChannel = 0;

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage = [
                144 + midiChannel, // Code for a note on: 10010000 & midi channel (0-15)
                note, // MIDI Note
                100 // MIDI Velocity
            ];
        
            let noteOffMessage = [
                128 + midiChannel, // Code for a note off: 10000000 & midi channel (0-15)
                note, // MIDI Note
                0 // MIDI Velocity
            ];
        
            // Including rnbo.min.js (or the unminified rnbo.js) will add the RNBO object
            // to the global namespace. This includes the TimeNow constant as well as
            // the MIDIEvent constructor.
            let midiPort = 0;
            let noteDurationMs = 250;
        
            // When scheduling an event to occur in the future, use the current audio context time
            // multiplied by 1000 (converting seconds to milliseconds) for now.
            let noteOnEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000, midiPort, noteOnMessage);
            let noteOffEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000 + noteDurationMs, midiPort, noteOffMessage);
        
            device.scheduleEvent(noteOnEvent);
            device.scheduleEvent(noteOffEvent);

            key.classList.add("clicked");
        });

        key.addEventListener("pointerup", () => key.classList.remove("clicked"));

        mdiv.appendChild(key);
    });
}

function playNoteOn(note, device) {
    const midiChannel = 0;
    const midiPort = 0;

    const noteOnMessage = [
        144 + midiChannel, // Note On
        note,              // MIDI Note
        100                // Velocity
    ];

    const noteOnEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000, midiPort, noteOnMessage);
    device.scheduleEvent(noteOnEvent);

    // Ripple effect and gradient
    const button = Array.from(document.getElementById('rnbo-clickable-keyboard').children)
        .find(div => div.textContent.trim() === note.toString());
    if (button) {
        button.classList.add('ripple');
        setTimeout(() => button.classList.remove('ripple'), 500);
    }

    document.body.style.background = `linear-gradient(45deg, rgba(${note * 2}, ${note * 3}, ${note * 4}, 1), rgba(${note * 5}, ${note * 6}, ${note * 7}, 1))`;
    setTimeout(() => {
        document.body.style.background = '';
    }, 1000);
}



function playNoteOff(note, device) {
    const midiChannel = 0;
    const midiPort = 0;

    const noteOffMessage = [
        128 + midiChannel, // Note Off
        note,              // MIDI Note
        0                  // Velocity
    ];

    const noteOffEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000, midiPort, noteOffMessage);
    device.scheduleEvent(noteOffEvent);
}

setup();
