document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const linksContainer = document.getElementById('linksContainer');
    const addLinkBtn = document.getElementById('addLinkBtn');
    const linkModal = document.getElementById('linkModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const linkForm = document.getElementById('linkForm');
    const modalTitle = document.getElementById('modalTitle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const contextMenu = document.getElementById('contextMenu');
    const emptyState = document.getElementById('emptyState');
    
    // State
    let links = JSON.parse(localStorage.getItem('quickLinks')) || getDefaultLinks();
    let editingId = null;
    let contextMenuTargetId = null;

    // Initial Render
    renderLinks();
    initTheme();

    // Event Listeners
    addLinkBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    linkForm.addEventListener('submit', handleFormSubmit);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Context Menu Events
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });

    document.getElementById('editOption').addEventListener('click', () => {
        if (contextMenuTargetId) {
            const link = links.find(l => l.id === contextMenuTargetId);
            if (link) openModal(link);
            hideContextMenu();
        }
    });

    document.getElementById('deleteOption').addEventListener('click', () => {
        if (contextMenuTargetId) {
            deleteLink(contextMenuTargetId);
            hideContextMenu();
        }
    });

    // Functions

    function getDefaultLinks() {
        return [
    {
        id: '1',
        title: 'ChatGPT',
        url: 'https://chat.openai.com',
        description: 'OpenAI',
        icon: ''
    },
    {
        id: '2',
        title: 'Gemini',
        url: 'https://gemini.google.com',
        description: 'Google AI',
        icon: ''
    },
    {
        id: '3',
        title: 'Grok',
        url: 'https://grok.x.ai',
        description: 'xAI Assistant',
        icon: ''
    },
    {
        id: '4',
        title: 'Facebook',
        url: 'https://www.facebook.com',
        description: 'Social Network',
        icon: ''
    },
    {
        id: '5',
        title: 'GitHub',
        url: 'https://github.com',
        description: 'Code Repository',
        icon: ''
    },
    {
        id: '6',
        title: 'YouTube',
        url: 'https://www.youtube.com',
        description: 'Video Platform',
        icon: ''
    },
    {
        id: '7',
        title: 'X / Twitter',
        url: 'https://x.com',
        description: 'Social Media',
        icon: ''
    },
    {
        id: '8',
        title: 'LinkedIn',
        url: 'https://www.linkedin.com',
        description: 'Professional Network',
        icon: ''
    },
    {
        id: '9',
        title: 'Gmail',
        url: 'https://mail.google.com',
        description: 'Email Service',
        icon: ''
    },
    {
        id: '10',
        title: 'Reddit',
        url: 'https://www.reddit.com',
        description: 'Discussion Forum',
        icon: ''
    },
    {
        id: '11',
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        description: 'Developer Q&A',
        icon: ''
    },
    {
        id: '12',
        title: 'Notion',
        url: 'https://www.notion.so',
        description: 'Notes & Projects',
        icon: ''
    },
    {
        id: '13',
        title: 'YouTube Music',
        url: 'https://music.youtube.com',
        description: 'Music Streaming',
        icon: ''
    },
    {
        id: '14',
        title: 'SABIS',
        url: 'https://sabis.sakarya.edu.tr',
        description: 'Sakarya University',
        icon: ''
    },
    {
        id: '15',
        title: 'Google Drive',
        url: 'https://drive.google.com/drive/my-drive',
        description: 'Cloud Storage',
        icon: ''
    },
    {
        id: '16',
        title: 'Logout From Internet',
        url: '',  // no URL was provided originally
        description: 'Network Logout',
        icon: ''
    },
    {
        id: '17',
        title: 'Google Translate',
        url: 'https://translate.google.com',
        description: 'Translator',
        icon: ''
    },
    {
        id: '18',
        title: 'Longman Dictionary',
        url: 'https://www.ldoceonline.com/dictionary',
        description: 'English Dictionary',
        icon: ''
    },
    {
        id: '19',
        title: 'Coursera',
        url: 'https://www.coursera.org',
        description: 'Online Courses',
        icon: ''
    },
    {
        id: '20',
        title: 'Chess.com',
        url: 'https://www.chess.com/play',
        description: 'Play Chess Online',
        icon: ''
    },
    {
        id: '21',
        title: 'Yemek Menüsü',
        url: 'https://menu.sabis.sakarya.edu.tr/Home/AylikMenu',
        description: 'Sakarya University Food Menu',
        icon: ''
    },
    {
        id: '22',
        title: 'WhatsApp Web',
        url: 'https://web.whatsapp.com',
        description: 'Messaging',
        icon: ''
    },
    {
        id: '23',
        title: 'Arabsead',
        url: 'https://a.asd.homes/recently/',
        description: '',
        icon: ''
    },
    {
        id: '24',
        title: 'Films',
        url: '',  // no URL was provided originally
        description: 'Movies',
        icon: ''
    },
    {
        id: '25',
        title: 'films2',
        url: '',  // no URL was provided originally
        description: 'Movies',
        icon: ''
    }
];
    }

    function renderLinks() {
        linksContainer.innerHTML = '';
        
        if (links.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        links.forEach(link => {
            const card = createLinkCard(link);
            linksContainer.appendChild(card);
        });
    }

    function createLinkCard(link) {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'site-card';
        a.dataset.id = link.id;

        // Icon Logic
        const iconUrl = link.icon || `https://www.google.com/s2/favicons?domain=${getDomain(link.url)}&sz=128`;
        
        a.innerHTML = `
            <div class="icon-container">
                <img src="${iconUrl}" alt="${link.title}" onerror="this.src='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/globe.svg'">
            </div>
            <div class="card-info">
                <h3>${link.title}</h3>
                <p>${link.description || getDomain(link.url)}</p>
            </div>
        `;

        // Context Menu Handler
        a.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e.pageX, e.pageY, link.id);
        });

        return a;
    }

    function getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('linkName').value;
        const url = document.getElementById('linkUrl').value;
        const description = document.getElementById('linkDescription').value;
        const icon = document.getElementById('linkIconUrl').value;

        if (editingId) {
            // Update existing
            links = links.map(l => l.id === editingId ? { ...l, title, url, description, icon } : l);
        } else {
            // Add new
            const newLink = {
                id: Date.now().toString(),
                title,
                url: url.startsWith('http') ? url : `https://${url}`,
                description,
                icon
            };
            links.push(newLink);
        }

        saveLinks();
        renderLinks();
        closeModal();
    }

    function deleteLink(id) {
        if (confirm('Are you sure you want to delete this link?')) {
            links = links.filter(l => l.id !== id);
            saveLinks();
            renderLinks();
        }
    }

    function saveLinks() {
        localStorage.setItem('quickLinks', JSON.stringify(links));
    }

    function openModal(link = null) {
        if (link) {
            editingId = link.id;
            modalTitle.textContent = 'Edit Link';
            document.getElementById('linkName').value = link.title;
            document.getElementById('linkUrl').value = link.url;
            document.getElementById('linkDescription').value = link.description;
            document.getElementById('linkIconUrl').value = link.icon;
        } else {
            editingId = null;
            modalTitle.textContent = 'Add New Link';
            linkForm.reset();
        }
        
        linkModal.classList.remove('hidden');
        // Small delay to allow display:block to apply before adding active class for transition
        setTimeout(() => linkModal.classList.add('active'), 10);
    }

    function closeModal() {
        linkModal.classList.remove('active');
        setTimeout(() => linkModal.classList.add('hidden'), 300);
    }

    function showContextMenu(x, y, id) {
        contextMenuTargetId = id;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.remove('hidden');
    }

    function hideContextMenu() {
        contextMenu.classList.add('hidden');
        contextMenuTargetId = null;
    }

    // Theme Handling
    function initTheme() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            updateThemeIcon(true);
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        updateThemeIcon(isDark);
    }

    function updateThemeIcon(isDark) {
        const icon = darkModeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});
