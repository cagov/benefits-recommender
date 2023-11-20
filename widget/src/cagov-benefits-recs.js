export class CaGovBenefitsRecs extends window.HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const attributes = this.getAttributeNames().reduce((bucket, name) => {
      bucket[name] = this.getAttribute(name);
      return bucket;
    }, {});

    const { endpoint, host, language, ...rest } = attributes;

    // this.attributes is reserved by JS spec, so this.attrs it is.
    this.attrs = {
      language: language || document.documentElement.lang,
      host: host || window.location.href,
      ...rest,
    };

    this.endpoint = endpoint || "https://br.api.innovation.ca.gov";

    const benefitsUrl = new URL("/benefits", this.endpoint);

    // We'll append the query parameters to the URL of our API call.
    Object.keys(this.attrs).forEach((key) => {
      benefitsUrl.searchParams.append(key, this.attrs[key]);
    });

    // Retrieve set of benefits links from API.
    fetch(benefitsUrl.href, { headers: { Accept: "text/html" } })
      .then(async (response) => {
        const html = await response.text();

        // Only render the widget if we actually get valid links.
        if (html && response.ok) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.innerHTML = html;

          const sectionEl = this.shadowRoot.querySelector("section");
          this.apiData = { ...sectionEl.dataset };

          this.recordEvent("render");
          this.applyListeners();
        }
      })
      .catch((error) => {
        throw new Error(
          `Benefits Recommendation API unavailable. Hiding widget.`,
          { cause: error }
        );
      });
  }

  recordEvent(event, details = {}) {
    const defaults = {
      displayURL: window.location.toString(),
      userAgent: navigator.userAgent,
      language: this.attrs.language,
      apiData: this.apiData,
    };

    const data = Object.assign({ event }, defaults, details);
    const eventUrl = new URL("/event", this.endpoint);

    navigator.sendBeacon(eventUrl.href, JSON.stringify(data));
  }

  applyListeners() {
    const benefitsLinks = this.shadowRoot.querySelectorAll("ul.link-list a");
    benefitsLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        this.recordEvent("click", {
          link: event.target.closest("a").href,
          linkText: event.target.innerText.trim(),
        });
      });
    });
  }
}

window.customElements.define("cagov-benefits-recs", CaGovBenefitsRecs);
