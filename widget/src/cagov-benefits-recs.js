export class CaGovBenefitsRecs extends window.HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const defaultEndpoint = "https://br.api.innovation.ca.gov";
    this.endpoint = this.getAttribute("endpoint") || defaultEndpoint;

    const lang = document.querySelector("html").getAttribute("lang");
    this.language = this.getAttribute("language") || lang;

    this.income = this.getAttribute("income");
    this.host = this.getAttribute("host") || window.location.href;

    const benefitsUrl = new URL("/benefits", this.endpoint);

    // We'll append the query parameters to the URL of our API call.
    const queryKeys = ["host", "language"];
    queryKeys.forEach((key) => {
      if (this[key]) benefitsUrl.searchParams.append(key, this[key]);
    });

    // Retrieve set of benefits links from API.
    fetch(benefitsUrl.href, {
      headers: {
        Accept: "text/html",
      },
    })
      .then(async (response) => {
        const html = await response.text();

        // Only render the widget if we actually get valid links.
        if (html && response.ok) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.innerHTML = html;
          const section = this.shadowRoot.querySelector("section");

          this.experimentName = section.dataset.experimentName;
          this.experimentVariation = section.dataset.experimentVariation;

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
      language: this.language,
      income: this.income,
      experimentName: this.experimentName,
      experimentVariation: this.experimentVariation,
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
