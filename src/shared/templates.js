const defaultCss = /* css */ `
:host {
  --benefits-recs-background-color: #E1F1EE;
  --benefits-recs-highlight-color: #006C58;
  --benefits-recs-text-color: #000000;
  --benefits-recs-card-background-color: #FFFFFF;

  --benefits-recs-title-font-size: 2rem;
  --benefits-recs-tagline-font-size: 1.25rem;
  --benefits-recs-lead-font-size: 1.4375rem;
  --benefits-recs-catalyst-font-size: 1.25rem;
  --benefits-recs-padding: 2rem;
  --benefits-recs-gap: 1rem;
  --benefits-recs-card-padding: 1.25rem;
  --benefits-recs-card-gap: 1rem;
  --benefits-recs-link-end-gap: 0.5rem;
}

@media (max-width: 28.75rem) {
  :host {
    --benefits-recs-title-font-size: 1.5rem;
    --benefits-recs-tagline-font-size: 0.9375rem;
    --benefits-recs-lead-font-size: 1.125rem;
    --benefits-recs-catalyst-font-size: 0.9375rem;
    --benefits-recs-padding: 1.52rem;
    --benefits-recs-gap: 0.76rem;
    --benefits-recs-card-padding: 0.95rem;
    --benefits-recs-card-gap: 0.76rem;
    --benefits-recs-link-end-gap: 0.38rem;
  }
}

section {
  background: var(--benefits-recs-background-color);
  border-left: 3px solid var(--benefits-recs-highlight-color);
  padding: var(--benefits-recs-padding);
  display: flex;
  flex-direction: column;
  gap: var(--benefits-recs-gap);
  max-width: 46.875rem;
  font-family: system-ui, sans-serif;
}

h2 {
  font-size: var(--benefits-recs-title-font-size);
  font-weight: 600;
  color: var(--benefits-recs-highlight-color);
}

.tagline {
  font-size: var(--benefits-recs-tagline-font-size);
}

.lead {
  font-size: var(--benefits-recs-lead-font-size);
  font-weight: 700;
}

.catalyst {
  font-size: var(--benefits-recs-catalyst-font-size);
  text-align: right;
  flex-grow: 2;
}

h2, .tagline {
  margin: 0;
}

.tagline, .catalyst, .lead {
  color: var(--benefits-recs-text-color);
}

ul.link-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: var(--benefits-recs-gap);
}

ul.link-list li {
  list-style: none;
  background: var(--benefits-recs-card-background-color);
  flex-grow: 1;
  max-width: 100%;
  border-radius: 0.3125rem
}

ul.link-list li a {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--benefits-recs-card-gap);
  padding: var(--benefits-recs-card-padding);
  text-decoration: none;
  color: #000;
}

ul.link-list li a:hover {
  box-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.25);
}

.link-start {
  display: flex;
  gap: var(--benefits-recs-card-gap);
  align-items: center;
}

.link-end {
  display: flex;
  flex-grow: 2;
  align-items: center;
  gap: var(--benefits-recs-link-end-gap);
}

.link-icon, .open-icon {
  display: inline-flex
}

.link-icon {
  height: 40px;
  width: 40px;
  align-items: center;
}
`;

const openIcon = /* html */ `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_1425_1913)">
    <path d="M13.4696 5.88672V7.35634H16.1149L8.9138 14.5575L9.94253 15.5862L17.1437 8.38507V11.0304H18.6133V5.88672H13.4696ZM17.1437 17.6437H6.85634V7.35634H12V5.88672H6.85634C6.04805 5.88672 5.38672 6.54805 5.38672 7.35634V17.6437C5.38672 18.452 6.04805 19.1133 6.85634 19.1133H17.1437C17.952 19.1133 18.6133 18.452 18.6133 17.6437V12.5H17.1437V17.6437Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0_1425_1913">
      <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
    </clipPath>
  </defs>
</svg>
`;

const defaultLinkHtml = (link) => /* html */ `
<li>
  <a href="${link.url}" target="_blank" rel="noopener noreferrer">
    <span class="link-start">
      <span class="link-icon" aria-hidden="true">${link.graphic}</span>
      <span class="lead">${link.lead}</span>
    </span>
    <span class="link-end">
      <span class="catalyst">${link.catalyst}</span>
      <span class="open-icon" aria-hidden="true">${openIcon}</span>
    </span>
  </a>
</li>
`;

const defaultHtml = (data) => {
  const linkList = data.links.map((link) => defaultLinkHtml(link)).join("\n");

  return /* html */ `
    <section 
      aria-label="benefits recommendations"
      data-experiment-name="${data.experimentName}"
      data-experiment-variation="${data.experimentVariation}"
      data-host-query="${data.host.query}"
      data-host-selection="${data.host.selection}"
      data-language-query="${data.language.query}"
      data-language-selection="${data.language.selection}"
    >
      <h2>${data.header}</h2>
      <p class="tagline">${data.tagline}</p>
      <ul class="link-list">
        ${linkList}
      </ul>
    </section>
  `;
};

const defaultTemplate = (data) => /* html */ `
  <style>
    ${defaultCss}
  </style>
  ${defaultHtml(data)}
`;

const eddUiTemplate = (data) => /* html */ `
  <style>
    ${defaultCss}
    section {
      margin: 3rem 0;
    }
  </style>
  ${defaultHtml(data)}
`;

exports.generateHtml = (data, hostDef) => {
  if (hostDef?.id === "edd_ui_recert") {
    return eddUiTemplate(data);
  }

  return defaultTemplate(data);
};
