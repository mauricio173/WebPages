// --- Create Delete Button Dynamically ---
const directDeleteBtn = document.createElement('button');
directDeleteBtn.id = 'direct-delete-tool-btn';
directDeleteBtn.className = 'btn btn-danger';
directDeleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:1rem;height:1rem">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
    </svg>
    <span>Excluir</span>
`;

document.addEventListener('DOMContentLoaded', () => {
    // --- State, Constants & Initial Data ---
    let TOOLS = [];
    let currentFormState = {};

    const FONT_AWESOME_ICONS = [
        'fa-star', 'fa-heart', 'fa-music', 'fa-camera', 'fa-video', 'fa-envelope',
        'fa-user', 'fa-cog', 'fa-wrench', 'fa-home', 'fa-calendar-alt', 'fa-clock',
        'fa-folder', 'fa-file-alt', 'fa-chart-bar', 'fa-globe', 'fa-lightbulb', 'fa-search',
        'fa-utensils', 'fa-car', 'fa-film', 'fa-tshirt', 'fa-shopping-cart', 'fa-plane',
        'fa-gas-pump', 'fa-heartbeat', 'fa-pills', 'fa-graduation-cap', 'fa-book', 'fa-gift',
        'fa-paw', 'fa-wallet', 'fa-money-bill-wave', 'fa-cloud', 'fa-credit-card', 'fa-briefcase',
        'fa-shop', 'fa-calculator', 'fa-mug-saucer', 'fa-coins', 'fa-bell', 'fa-train',
        'fa-receipt', 'fa-piggy-bank', 'fa-chart-line', 'fa-hand-holding-dollar', 'fa-fire'
    ];

    const DEFAULT_TOOLS = [
      { id: 'roteiro', name: 'Gerador de Roteiro', description: 'Escreva, crie e edite roteiros virais para midias em vídeo.', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>', modalLinks: [{ name: 'Ferramenta de Script Rápido', href: '#' },{ name: 'Gerador de Ideias', href: '#' },{ name: 'Analisador de Título', href: '#' }] },
      { id: 'calculator', name: 'Calculadora', description: 'Realize cálculos matemáticos de forma rápida e precisa.', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>', modalLinks: [] },
      { id: 'weather', name: 'Clima', description: 'Consulte a previsão do tempo para qualquer cidade.', href: '#', icon: '<i class="fas fa-cloud"></i>', modalLinks: [] },
      { id: 'calendar', name: 'Calendário', description: 'Organize seus eventos, tarefas e compromissos.', href: '#', icon: '<i class="fas fa-calendar-alt"></i>', modalLinks: [] },
      { id: 'notes', name: 'Anotações', description: 'Crie e gerencie notas de texto de forma simples e eficaz.', href: '#', icon: '<i class="fas fa-file-alt"></i>', modalLinks: [] },
    ];

    // --- DOM Element Selectors ---
    const openBtn = document.getElementById("openBtn");
    const closeBtn = document.getElementById("closeBtn");
    const sidenav = document.getElementById("mySidenav");
    const overlay = document.getElementById("sidenav-overlay");
    const toolGrid = document.getElementById('tool-grid');
    const searchInput = document.getElementById('searchInput');
    const toolCountEl = document.getElementById('tool-count');
    
    const infoModal = document.getElementById('info-modal');
    const modalIconEl = document.getElementById('modal-icon');
    const modalNameEl = document.getElementById('modal-name');
    const modalDescriptionEl = document.getElementById('modal-description');
    const modalLinksEl = document.getElementById('modal-links');
    
    const manageToolsBtn = document.getElementById('manageToolsBtn');
    const manageToolsModal = document.getElementById('manage-tools-modal');
    const toolSelect = document.getElementById('tool-select');
    const addToolBtn = document.getElementById('add-tool-btn');
    const editToolBtn = document.getElementById('edit-tool-btn');
    const deleteToolBtn = document.getElementById('delete-tool-btn');
    const linksManagementSection = document.getElementById('links-management-section');
    const linksList = document.getElementById('links-list');
    const addLinkBtn = document.getElementById('add-link-btn');

    const formModal = document.getElementById('form-modal');
    const formModalTitle = document.getElementById('form-modal-title');
    const toolLinkForm = document.getElementById('tool-link-form');
    const formFields = document.getElementById('form-fields');
    const formCancelBtn = document.getElementById('form-cancel-btn');
    const directEditToolBtn = document.getElementById('direct-edit-tool-btn');
    
    // --- Data Persistence ---
    function saveTools() {
        localStorage.setItem('dashboardTools', JSON.stringify(TOOLS));
    }

    function loadTools() {
        const storedTools = localStorage.getItem('dashboardTools');
        TOOLS = storedTools ? JSON.parse(storedTools) : [...DEFAULT_TOOLS];
    }

    // --- Render Functions ---
    function renderAll() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTools = TOOLS.filter(tool => tool.name.toLowerCase().includes(searchTerm));
        renderToolsGrid(filteredTools);
        populateToolSelector();
    }

    function renderToolsGrid(toolsToRender) {
      toolGrid.innerHTML = '';
      toolsToRender.forEach((tool, index) => {
        const card = document.createElement('a');
        card.href = '#';
        card.className = 'tool-card';
        card.setAttribute('aria-label', tool.name);
        card.dataset.toolId = tool.id;
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
          <div class="info-icon" title="Gerenciar ${tool.name}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
          </div>
          <div class="icon-container">${tool.icon}</div>
          <h3>${tool.name}</h3>
          <p>${tool.description}</p>
        `;
        toolGrid.appendChild(card);
      });
      updateToolCount(toolsToRender.length);
    }

    function updateToolCount(visibleCount) {
      toolCountEl.textContent = `Exibindo ${visibleCount} de ${TOOLS.length} ferramentas.`;
    }
    
    function populateToolSelector() {
        const currentVal = toolSelect.value;
        toolSelect.innerHTML = '<option value="">-- Selecione uma ferramenta --</option>';
        TOOLS.forEach(tool => {
            const option = document.createElement('option');
            option.value = tool.id;
            option.textContent = tool.name;
            toolSelect.appendChild(option);
        });
        toolSelect.value = currentVal;
    }
    
    function renderLinksList(toolId) {
        const tool = TOOLS.find(t => t.id === toolId);
        linksList.innerHTML = '';
        if (!tool || !tool.modalLinks || tool.modalLinks.length === 0) {
            linksList.innerHTML = '<li>Nenhum link encontrado.</li>';
            return;
        }
        tool.modalLinks.forEach((link, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="link-name" title="${link.name} (${link.href})">${link.name}</span>
                <div class="link-actions">
                    <button class="edit-link-btn" data-index="${index}" title="Editar Link">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button class="delete-link-btn" data-index="${index}" title="Excluir Link">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                </div>
            `;
            linksList.appendChild(li);
        });
    }

    const renderIconPicker = (container) => {
        container.innerHTML = FONT_AWESOME_ICONS.map(iconClass => 
            `<button type="button" data-icon="${iconClass}" title="${iconClass}">
                <i class="fas ${iconClass}"></i>
            </button>`
        ).join('');
    };
    
    // --- Modal Control ---
    function openModal(modalEl) { modalEl.classList.add('active'); }
    function closeModal(modalEl) { 
        modalEl.classList.remove('active');
        if (modalEl === infoModal) {
            // Clean up the dynamically added delete button
            if (directDeleteBtn.parentElement) {
                directDeleteBtn.parentElement.removeChild(directDeleteBtn);
            }
        }
        if (modalEl === manageToolsModal) {
            toolSelect.value = '';
            // Manually trigger the change event to reset the UI state
            toolSelect.dispatchEvent(new Event('change'));
        }
    }

    function openInfoModal(tool) {
        infoModal.dataset.currentToolId = tool.id;
        modalIconEl.innerHTML = tool.icon;
        modalNameEl.textContent = tool.name;
        modalDescriptionEl.textContent = tool.description;
        
        modalLinksEl.innerHTML = ''; // Clear previous content

        // Create a header container
        const linksHeaderContainer = document.createElement('div');
        linksHeaderContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;';

        // Create the title
        const linksTitle = document.createElement('h3');
        linksTitle.textContent = 'Links';
        linksTitle.style.cssText = 'margin: 0; color: var(--color-slate-200); font-size: 1.125rem; font-weight: 600;';

        // Create the gear button
        const manageLinksBtn = document.createElement('button');
        manageLinksBtn.title = 'Gerenciar Links';
        manageLinksBtn.style.cssText = 'background: none; border: none; color: var(--color-slate-400); cursor: pointer; padding: 0.25rem; line-height: 1; transition: color 0.2s;';
        manageLinksBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.25rem; height: 1.25rem; display: block;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        `;
        manageLinksBtn.addEventListener('mouseenter', () => manageLinksBtn.style.color = 'var(--color-white)');
        manageLinksBtn.addEventListener('mouseleave', () => manageLinksBtn.style.color = 'var(--color-slate-400)');
        manageLinksBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal(infoModal);
            openModal(manageToolsModal);
            populateToolSelector();
            toolSelect.value = tool.id;
            toolSelect.dispatchEvent(new Event('change'));
        });

        linksHeaderContainer.appendChild(linksTitle);
        linksHeaderContainer.appendChild(manageLinksBtn);
        modalLinksEl.appendChild(linksHeaderContainer);

        const linkListContainer = document.createElement('div');
        if (tool.modalLinks && tool.modalLinks.length > 0) {
          tool.modalLinks.forEach(link => {
            const linkEl = document.createElement('a');
            linkEl.href = link.href;
            linkEl.textContent = link.name;
            linkEl.target = '_blank';
            linkEl.rel = 'noopener noreferrer';
            linkListContainer.appendChild(linkEl);
          });
        } else {
            const noLinkEl = document.createElement('p');
            noLinkEl.textContent = "Nenhum link adicionado.";
            noLinkEl.style.cssText = 'font-size: 0.875rem; color: var(--color-slate-400); margin: 0;';
            linkListContainer.appendChild(noLinkEl);
        }
        modalLinksEl.appendChild(linkListContainer);
        
        // Add action buttons
        const modalActions = infoModal.querySelector('.modal-actions');
        modalActions.appendChild(directDeleteBtn);

        openModal(infoModal);
    }

    // --- Form Handling ---
    function showEditToolForm(tool) {
        if (!tool) return;
        openFormModal({
            mode: 'edit-tool',
            toolId: tool.id,
            title: 'Editar Ferramenta',
            fields: getToolFormFields(tool)
        });
    }

    function openFormModal(state) {
        currentFormState = state;
        formModalTitle.textContent = state.title;
        formFields.innerHTML = state.fields;
        openModal(formModal);

        const iconPicker = document.getElementById('iconPicker');
        if (iconPicker) {
            renderIconPicker(iconPicker);
            const iconTextarea = document.getElementById('icon-textarea');
            iconPicker.addEventListener('click', e => {
                const button = e.target.closest('button');
                if (button?.dataset.icon) {
                    const iconClass = button.dataset.icon;
                    iconTextarea.value = `<i class="fas ${iconClass}"></i>`;
                    
                    iconPicker.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                }
            });
        }
    }

    toolLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(toolLinkForm);
        const { mode, toolId, linkIndex } = currentFormState;

        if (mode === 'add-tool' || mode === 'edit-tool') {
            const toolData = {
                id: mode === 'add-tool' ? `tool-${Date.now()}` : toolId,
                name: formData.get('name'),
                description: formData.get('description'),
                href: formData.get('href'),
                icon: formData.get('icon'),
                modalLinks: mode === 'add-tool' ? [] : TOOLS.find(t=>t.id === toolId).modalLinks
            };
            if (mode === 'add-tool') {
                TOOLS.push(toolData);
            } else {
                const index = TOOLS.findIndex(t => t.id === toolId);
                TOOLS[index] = toolData;
            }
        }
        
        if (mode === 'add-link' || mode === 'edit-link') {
            const tool = TOOLS.find(t => t.id === toolId);
            const linkData = { name: formData.get('name'), href: formData.get('href') };
            if (mode === 'add-link') {
                tool.modalLinks.push(linkData);
            } else {
                tool.modalLinks[linkIndex] = linkData;
            }
        }

        saveTools();
        renderAll();
        closeModal(formModal);
        if (mode.includes('link')) renderLinksList(toolId);
        if (mode.includes('tool')) {
            linksManagementSection.style.display = 'none';
            editToolBtn.disabled = true;
            deleteToolBtn.disabled = true;
            toolSelect.value = '';
        }
    });

    // --- Event Listeners ---
    const closeNav = () => { sidenav.style.width = "0"; overlay.classList.remove('active'); };
    openBtn.addEventListener('click', () => { sidenav.style.width = "250px"; overlay.classList.add('active'); });
    closeBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTools = TOOLS.filter(tool => tool.name.toLowerCase().includes(searchTerm));
        renderToolsGrid(filteredTools);
    });

    toolGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.tool-card');
        if (!card) return;

        e.preventDefault();

        const toolId = card.dataset.toolId;
        const tool = TOOLS.find(t => t.id === toolId);
        if (!tool) return;

        const manageIcon = e.target.closest('.info-icon');

        if (manageIcon) {
            e.stopPropagation();
            openModal(manageToolsModal);
            populateToolSelector();
            toolSelect.value = tool.id;
            toolSelect.dispatchEvent(new Event('change'));
        } else {
            openInfoModal(tool);
        }
    });
    
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });

    // Management Modal Logic
    manageToolsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        populateToolSelector();
        openModal(manageToolsModal);
        closeNav();
    });

    toolSelect.addEventListener('change', (e) => {
        const selectedToolId = e.target.value;
        if (selectedToolId) {
            linksManagementSection.style.display = 'block';
            renderLinksList(selectedToolId);
            editToolBtn.disabled = false;
            deleteToolBtn.disabled = false;
        } else {
            linksManagementSection.style.display = 'none';
            editToolBtn.disabled = true;
            deleteToolBtn.disabled = true;
        }
    });

    const getToolFormFields = (tool = {}) => `
      <div class="form-group"><label for="name">Nome</label><input type="text" name="name" value="${tool.name || ''}" required></div>
      <div class="form-group"><label for="description">Descrição</label><input type="text" name="description" value="${tool.description || ''}" required></div>
      <div class="form-group"><label for="href">URL Principal (obsoleto)</label><input type="text" name="href" value="${tool.href || '#'}" required></div>
      <div class="form-group"><label for="icon">Ícone (SVG ou HTML)</label><textarea name="icon" id="icon-textarea" required>${tool.icon || ''}</textarea></div>
      <div class="form-group">
        <label>Ou selecione um ícone pré-definido</label>
        <div id="iconPicker"></div>
      </div>
    `;

    addToolBtn.addEventListener('click', () => {
        openFormModal({
            mode: 'add-tool',
            title: 'Adicionar Nova Ferramenta',
            fields: getToolFormFields()
        });
    });
    
    editToolBtn.addEventListener('click', () => {
        const toolId = toolSelect.value;
        const tool = TOOLS.find(t => t.id === toolId);
        showEditToolForm(tool);
    });

    directEditToolBtn.addEventListener('click', () => {
        const toolId = infoModal.dataset.currentToolId;
        const tool = TOOLS.find(t => t.id === toolId);
        if (tool) {
            closeModal(infoModal);
            showEditToolForm(tool);
        }
    });

    deleteToolBtn.addEventListener('click', () => {
        const toolId = toolSelect.value;
        const tool = TOOLS.find(t => t.id === toolId);
        if (tool && confirm(`Tem certeza que deseja excluir a ferramenta "${tool.name}"?`)) {
            TOOLS = TOOLS.filter(t => t.id !== toolId);
            saveTools();
            renderAll();
            linksManagementSection.style.display = 'none';
            editToolBtn.disabled = true;
            deleteToolBtn.disabled = true;
        }
    });

    directDeleteBtn.addEventListener('click', () => {
        const toolId = infoModal.dataset.currentToolId;
        const tool = TOOLS.find(t => t.id === toolId);
        if (tool && confirm(`Tem certeza que deseja excluir a ferramenta "${tool.name}"?`)) {
            TOOLS = TOOLS.filter(t => t.id !== toolId);
            saveTools();
            renderAll();
            closeModal(infoModal);

            if (toolSelect.value === toolId) {
                toolSelect.value = '';
                linksManagementSection.style.display = 'none';
                editToolBtn.disabled = true;
                deleteToolBtn.disabled = true;
            }
        }
    });
    
    addLinkBtn.addEventListener('click', () => {
        const toolId = toolSelect.value;
        if (!toolId) return;
        openFormModal({
            mode: 'add-link',
            toolId: toolId,
            title: 'Adicionar Novo Link',
            fields: `
                <div class="form-group"><label for="name">Nome do Link</label><input type="text" name="name" required></div>
                <div class="form-group"><label for="href">URL do Link</label><input type="text" name="href" required></div>
            `
        });
    });

    linksList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-link-btn');
        const deleteBtn = e.target.closest('.delete-link-btn');
        const toolId = toolSelect.value;
        const tool = TOOLS.find(t => t.id === toolId);
        if (!tool) return;

        if (editBtn) {
            const linkIndex = parseInt(editBtn.dataset.index, 10);
            const link = tool.modalLinks[linkIndex];
            openFormModal({
                mode: 'edit-link',
                toolId: toolId,
                linkIndex: linkIndex,
                title: 'Editar Link',
                fields: `
                    <div class="form-group"><label for="name">Nome do Link</label><input type="text" name="name" value="${link.name}" required></div>
                    <div class="form-group"><label for="href">URL do Link</label><input type="text" name="href" value="${link.href}" required></div>
                `
            });
        }

        if (deleteBtn) {
            const linkIndex = parseInt(deleteBtn.dataset.index, 10);
            const link = tool.modalLinks[linkIndex];
            if (confirm(`Tem certeza que deseja excluir o link "${link.name}"?`)) {
                tool.modalLinks.splice(linkIndex, 1);
                saveTools();
                renderAll();
                renderLinksList(toolId);
            }
        }
    });

    formCancelBtn.addEventListener('click', () => closeModal(formModal));

    // --- Initialization ---
    loadTools();
    renderAll();
});
