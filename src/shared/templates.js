const defaultCss = /* css */ `
:host {
  --benefits-recs-background: #E7EEF9;
  --benefits-recs-list-background: #FFF;
  --benefits-recs-list-border-color: #D4D4D7;
  --benefits-recs-icon-background: #EDEDEF;
  --benefits-recs-icon-fill: #003688;
  --benefits-recs-text-color: #3B3A48;
  --benefits-recs-link-color: #165AC2;
}

section {
  background: var(--benefits-recs-background);
  padding: 1.5rem;
  max-width: 42.25rem;
  font-family: system-ui, sans-serif;
}

h2 {
  color: var(--benefits-recs-text-color);
  font-size: 2.3125rem;
  font-weight: 700;
  line-height: 3.17969rem;
  margin: 0 0 1.5rem 0;
}
@media (max-width: 28.75rem) {
  h2 {
    font-size: 2.0625rem;
    line-height: 2.5625rem;
  }
}

.lead {
  color: var(--benefits-recs-text-color);
  font-size: 1.4375rem;
  font-weight: 700;
  line-height: 2.33594rem;
}
@media (max-width: 28.75rem) {
  .lead {
    font-size: 1.25rem;
    line-height: 2.03125rem;
  }
}

.catalyst {
  color: var(--benefits-recs-link-color);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 2rem;
}
@media (max-width: 28.75rem) {
  .catalyst {
    font-size: 1rem;
    line-height: 1.6875rem;
  }
}

ul.link-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  border: 1px solid var(--benefits-recs-list-border-color);
  background: var(--benefits-recs-list-background);
}

ul.link-list li {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 1.5rem;
  border-bottom: 1px solid var(--benefits-recs-list-border-color);
}

ul.link-list li:last-child {
  border-bottom: none;
}

.open-icon {
  display: inline-flex;
  margin: 0 0.25rem;
  fill: var(--benefits-recs-link-color);
}

.link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--benefits-recs-icon-background);
  fill: var(--benefits-recs-icon-fill);
}
`;

const openIcon = /* html */ `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.918671 8.84999C0.918671 7.58133 0.909338 6.31266 0.922005 5.04399C0.934671 3.48799 1.80934 2.61599 3.35934 2.60933C4.66534 2.60333 5.97467 2.60333 7.28134 2.60933C7.88134 2.61266 8.222 2.87799 8.23734 3.32466C8.25267 3.79333 7.89667 4.08733 7.26867 4.08999C5.96267 4.09599 4.65334 4.08666 3.34667 4.09333C2.6 4.09666 2.384 4.31866 2.384 5.08066C2.38067 7.59933 2.38067 10.1153 2.384 12.634C2.384 13.3653 2.628 13.6027 3.37467 13.6027C5.89334 13.606 8.40934 13.606 10.928 13.6027C11.6687 13.6027 11.8907 13.3747 11.8933 12.6153C11.8967 11.328 11.8933 10.04 11.8967 8.75266C11.9 8.10599 12.156 7.75866 12.6247 7.74933C13.0967 7.73999 13.378 8.09333 13.3807 8.72466C13.3867 10.0713 13.3933 11.4187 13.3773 12.7653C13.362 14.1307 12.4713 15.0527 11.102 15.062C8.46734 15.084 5.83334 15.084 3.19867 15.062C1.81134 15.0493 0.945338 14.162 0.926671 12.7713C0.901338 11.4653 0.917338 10.1587 0.917338 8.84933L0.918671 8.84999Z"/>
  <path d="M13.0407 1.88733C12.144 1.88733 11.3847 1.89333 10.6253 1.884C10.0347 1.878 9.69066 1.59667 9.72199 1.13067C9.75666 0.583999 10.122 0.421333 10.6093 0.417999C11.994 0.408666 13.3813 0.389999 14.7653 0.389999C15.2687 0.389999 15.5933 0.736666 15.59 1.25533C15.584 2.62067 15.5773 3.99 15.5587 5.35533C15.5527 5.96133 15.2807 6.27733 14.812 6.26467C14.3493 6.252 14.1027 5.93 14.0993 5.32067C14.096 4.56733 14.0993 3.81733 14.0993 2.952C13.868 3.16467 13.7273 3.28933 13.596 3.42067C11.6053 5.408 9.61799 7.39533 7.63066 9.386C7.52132 9.49533 7.41532 9.61133 7.29599 9.714C6.94932 10.0173 6.58332 10.0387 6.25532 9.70133C5.94932 9.386 5.97066 9.036 6.25199 8.70467C6.35199 8.586 6.46732 8.47933 6.57999 8.37C8.56732 6.38267 10.558 4.39533 12.5453 2.40467C12.68 2.27 12.808 2.12933 13.0393 1.886L13.0407 1.88733Z"/>
</svg>
`;

const defaultLinkHtml = (link) => /* html */ `
<li>
  <span class="link-icon" aria-hidden="true">${link.graphic}</span>
  <span class="lead">${link.lead}</span>
  <a class="catalyst" href="${link.url}" target="_blank" rel="noopener noreferrer">
    ${link.catalyst}<span class="open-icon" aria-hidden="true">${openIcon}</span>
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
