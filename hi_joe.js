function toggleBackground() {
    const body = document.body;
    const isDark = body.dataset.theme === 'dark';
    body.dataset.theme = isDark ? 'light' : 'dark';
}

function isLinkLine(line) {
    return line.startsWith('https://') || line.startsWith('http://') || line.startsWith('contents/');
}

async function updateLinkCount(filePath, countId, linkType) {
    const countElement = document.getElementById(countId);

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        const count = text.split('\n').filter(line => isLinkLine(line.trim())).length;
        countElement.textContent = count;
    } catch (error) {
        countElement.textContent = 'Unavailable';
        console.error(`Error counting ${linkType}:`, error);
    }
}

function loadCircuits() {
    const container = document.getElementById('circuitsContainer');
    
    // Toggle visibility
    if (container.style.display === 'block') {
        container.style.display = 'none';
        return;
    }
    
    // Load URLs from falstad_circuits.txt
    fetch('contents/falstad_circuits.txt')
        .then(response => response.text())
        .then(text => {
            // Parse the text file to extract URLs
            const lines = text.split('\n');
            const urls = [];
            const labels = [];
            
            for (let line of lines) {
                line = line.trim();
                // Extract URLs that start with http
                if (isLinkLine(line)) {
                    urls.push(line);
                }
                else if (line.startsWith('Label:')) {
                    labels.push(line.replace('Label:', '').trim());
                }
            }
            
            console.log('Loaded circuits:', urls);
            console.log('Loaded labels:', labels);
            
            // Render URLs in the circuitsContainer div
            container.innerHTML = ''; // Clear existing content
            
            urls.forEach((url, index) => {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = labels[index] || `Circuit ${index + 1}`;
                link.classList.add('circuit-link');
                
                container.appendChild(link);
            });
            
            // Show the container
            container.style.display = 'block';
        })
        .catch(error => console.error('Error loading circuits:', error));
}

function loadchess() {
    const container = document.getElementById('chessContainer') || document.getElementById('circuitsContainer');

    if (!container) {
        console.error('No content container found for chess links.');
        return;
    }
    
    // Toggle visibility
    if (container.style.display === 'block') {
        container.style.display = 'none';
        return;
    }
    
    // Load URLs from chess_links.txt
    fetch('contents/chess_links.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            const urls = [];
            const labels = [];
            let pendingLabel = '';
            
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;

                if (isLinkLine(line)) {
                    urls.push(line);
                    labels.push(pendingLabel || `Chess ${urls.length}`);
                    pendingLabel = '';
                } else {
                    pendingLabel = line.replace(/^Label:\s*/, '').trim();
                }
            }
            
            console.log('Loaded chess links:', urls);
            console.log('Loaded chess labels:', labels);
            
            container.innerHTML = '';
            
            urls.forEach((url, index) => {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = labels[index] || `Chess ${index + 1}`;
                link.classList.add('circuit-link');
                
                container.appendChild(link);
            });
            
            container.style.display = 'block';
        })
        .catch(error => console.error('Error loading chess links:', error));
}

updateLinkCount('contents/falstad_circuits.txt', 'circuitCount', 'Falstad circuits');
updateLinkCount('contents/chess_links.txt', 'chessCount', 'chess links');
