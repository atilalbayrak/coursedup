(() => {
    const target = document.getElementById('legal-content');
    if (!target) return;

    target.replaceChildren();
    target.hidden = true;

    const type = target.dataset.legalDoc;
    const documents = {
        terms: {
            prefix: 'coursedup_terms_of_use_v',
            title: 'Terms of Use'
        },
        privacy: {
            prefix: 'coursedup_privacy_policy_v',
            title: 'Privacy Policy'
        },
        cookie: {
            prefix: 'coursedup_cookie_policy_v',
            title: 'Cookie Policy'
        }
    };

    const config = documents[type];
    if (!config) {
        target.textContent = 'Legal document could not be loaded.';
        target.hidden = false;
        return;
    }

    if (!window.mammoth) {
        target.textContent = 'Legal document could not be loaded.';
        target.hidden = false;
        return;
    }

    const versionName = number => String(number).padStart(3, '0');
    const fileName = number => `${config.prefix}${versionName(number)}.docx`;

    async function fileExists(number) {
        const url = `${fileName(number)}?probe=${Date.now()}`;
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                cache: 'no-store',
                credentials: 'same-origin'
            });
            if (response.ok) return true;
            if (response.status === 404) return false;
        } catch (error) {
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { Range: 'bytes=0-0' },
                cache: 'no-store',
                credentials: 'same-origin'
            });
            return response.ok || response.status === 206;
        } catch (error) {
            return false;
        }
    }

    async function findLatestVersion() {
        if (!(await fileExists(1))) throw new Error('v001 not found');

        let low = 1;
        let high = 2;

        while (high <= 9999 && await fileExists(high)) {
            low = high;
            high *= 2;
        }

        if (high > 9999) high = 10000;

        while (low + 1 < high) {
            const middle = Math.floor((low + high) / 2);
            if (await fileExists(middle)) {
                low = middle;
            } else {
                high = middle;
            }
        }

        return low;
    }

    function safeHref(value) {
        if (!value) return '';
        const trimmed = value.trim();
        if (/^(https?:|mailto:|\/|#)/i.test(trimmed)) return trimmed;
        return '';
    }

    function sanitizeHtml(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        const allowed = new Set(['P', 'STRONG', 'B', 'EM', 'I', 'U', 'OL', 'UL', 'LI', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'BR', 'SUB', 'SUP', 'BLOCKQUOTE']);
        const elements = [...template.content.querySelectorAll('*')];

        for (const element of elements) {
            if (!allowed.has(element.tagName)) {
                element.replaceWith(...element.childNodes);
                continue;
            }

            const originalHref = element.tagName === 'A' ? element.getAttribute('href') : '';

            for (const attribute of [...element.attributes]) {
                element.removeAttribute(attribute.name);
            }

            if (element.tagName === 'A') {
                const href = safeHref(originalHref);
                if (href) {
                    element.setAttribute('href', href);
                    if (/^https?:/i.test(href)) {
                        element.setAttribute('target', '_blank');
                        element.setAttribute('rel', 'noopener noreferrer');
                    }
                }
            }
        }

        return template.content;
    }

    function normalizeContent(fragment) {
        const wrapper = document.createElement('div');
        wrapper.append(fragment.cloneNode(true));

        const first = wrapper.firstElementChild;
        if (first && first.textContent.trim().toLowerCase() === config.title.toLowerCase()) {
            first.remove();
        }

        for (const heading of [...wrapper.querySelectorAll('h1')]) {
            const replacement = document.createElement('h3');
            replacement.innerHTML = heading.innerHTML;
            heading.replaceWith(replacement);
        }

        for (const heading of [...wrapper.querySelectorAll('h2')]) {
            const replacement = document.createElement('h4');
            replacement.innerHTML = heading.innerHTML;
            heading.replaceWith(replacement);
        }

        for (const paragraph of [...wrapper.querySelectorAll('p')]) {
            const text = paragraph.textContent.trim();
            if (!text) {
                paragraph.remove();
                continue;
            }

            const meaningfulChildren = [...paragraph.childNodes].filter(node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim());
            const onlyStrong = meaningfulChildren.length === 1 && meaningfulChildren[0].nodeType === Node.ELEMENT_NODE && ['STRONG', 'B'].includes(meaningfulChildren[0].tagName);

            if (onlyStrong && /^\d+(?:\.\d+)*\.?\s+\S/.test(text)) {
                const level = (text.match(/^\d+(?:\.\d+)*/) || [''])[0].split('.').length;
                const heading = document.createElement(level > 1 ? 'h4' : 'h3');
                heading.innerHTML = paragraph.innerHTML;
                paragraph.replaceWith(heading);
            }
        }

        const children = [...wrapper.children];
        let list = null;

        for (const child of children) {
            if (child.tagName === 'P' && /^\s*[•·]\s+/.test(child.textContent)) {
                if (!list) {
                    list = document.createElement('ul');
                    child.before(list);
                }
                const item = document.createElement('li');
                item.innerHTML = child.innerHTML.replace(/^\s*[•·]\s*/, '');
                list.append(item);
                child.remove();
            } else {
                list = null;
            }
        }

        return wrapper.innerHTML;
    }

    async function loadDocument(version) {
        const response = await fetch(`${fileName(version)}?v=${version}`, {
            method: 'GET',
            cache: 'no-store',
            credentials: 'same-origin'
        });

        if (!response.ok) throw new Error(`DOCX HTTP ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const result = await window.mammoth.convertToHtml(
            { arrayBuffer },
            {
                styleMap: [
                    "p[style-name='Heading 1'] => h3:fresh",
                    "p[style-name='Heading 2'] => h4:fresh",
                    "p[style-name='Heading 3'] => h5:fresh",
                    "p[style-name='Policy Bullet'] => p:fresh",
                    'u => u'
                ],
                includeDefaultStyleMap: true
            }
        );

        const safeFragment = sanitizeHtml(result.value);
        const normalized = normalizeContent(safeFragment);
        if (!normalized.trim()) throw new Error('Empty DOCX output');
        return normalized;
    }

    async function run() {
        try {
            const latest = await findLatestVersion();
            for (let version = latest; version >= 1; version--) {
                try {
                    const html = await loadDocument(version);
                    target.innerHTML = html;
                    target.dataset.legalVersion = versionName(version);
                    target.hidden = false;
                    return;
                } catch (error) {
                    console.error(`Legal DOCX v${versionName(version)} failed:`, error);
                }
            }

            throw new Error('No legal DOCX version could be loaded');
        } catch (error) {
            console.error('Legal DOCX load failed:', error);
            target.textContent = 'Legal document could not be loaded.';
            target.hidden = false;
        }
    }

    run();
})();
