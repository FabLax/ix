import { r as registerInstance, c as createEvent, h, f as forceUpdate, H as Host, g as getElement } from "./global.00f6d77e.js";
import { b as a11yHostAttributes, a as a11yBoolean } from "./a11y-2e34777f.c1195600.js";
import { c as createMutationObserver } from "./mutation-observer-db8757e6.4a24be36.js";
const breadcrumbCss = ":host{display:flex;justify-content:flex-start;height:2.5rem;align-items:center;background-color:transparent;overflow:hidden}:host *,:host *::after,:host *::before{box-sizing:border-box}:host ::-webkit-scrollbar-button{display:none}@-moz-document url-prefix(){:host *{scrollbar-color:var(--theme-scrollbar-thumb--background) var(--theme-scrollbar-track--background);scrollbar-width:thin}}:host ::-webkit-scrollbar{width:0.5rem;height:0.5rem}:host ::-webkit-scrollbar-track{border-radius:5px;background:var(--theme-scrollbar-track--background)}:host ::-webkit-scrollbar-track:hover{background:var(--theme-scrollbar-track--background--hover)}:host ::-webkit-scrollbar-thumb{border-radius:5px;background:var(--theme-scrollbar-thumb--background)}:host ::-webkit-scrollbar-thumb:hover{background:var(--theme-scrollbar-thumb--background--hover)}:host ::-webkit-scrollbar-corner{display:none}:host .previous-button{width:3rem;min-width:0px}:host .crumb-dropdown{overflow:visible}:host .remove-anchor::after{display:none}:host .more-text{display:flex}:host .more-text .more-text-ellipsis{width:1rem;display:inline-block;font-weight:700}:host .more-text ix-icon{padding-top:2px}:host nav,:host ol,:host .crumb-items{display:contents}";
const IxBreadcrumbStyle0 = breadcrumbCss;
let sequenceId = 0;
const createId = (prefix = "breadcrumb-") => {
  return `${prefix}-${sequenceId++}`;
};
const Breadcrumb = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.itemClick = createEvent(this, "itemClick", 7);
    this.nextClick = createEvent(this, "nextClick", 7);
    this.previousButtonId = createId();
    this.previousDropdownId = createId();
    this.visibleItemCount = 9;
    this.nextItems = [];
    this.ghost = true;
    this.ariaLabelPreviousButton = "previous";
    this.previousButtonRef = void 0;
    this.nextButtonRef = void 0;
    this.items = [];
    this.isPreviousDropdownExpanded = false;
  }
  onNextItemsChange() {
    this.onChildMutation();
  }
  onItemClick(item) {
    this.itemClick.emit(item);
  }
  componentDidLoad() {
    this.mutationObserver = createMutationObserver(() => this.onChildMutation());
    this.mutationObserver.observe(this.hostElement, {
      subtree: true,
      childList: true
    });
  }
  componentWillLoad() {
    this.onChildMutation();
  }
  disconnectedCallback() {
    var _a;
    (_a = this.mutationObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
  }
  async onChildMutation() {
    const updatedItems = this.getItems();
    updatedItems.forEach((bc, index) => {
      const shouldShowDropdown = this.nextItems.length !== 0 && updatedItems.length - 1 === index;
      bc.ghost = this.ghost;
      bc.showChevron = updatedItems.length - 1 !== index || shouldShowDropdown;
      bc.isDropdownTrigger = shouldShowDropdown;
      if (shouldShowDropdown) {
        this.nextButtonRef = bc;
      }
      if (updatedItems.length < this.visibleItemCount) {
        return;
      }
      bc.visible = index >= updatedItems.length - this.visibleItemCount;
    });
    this.items = updatedItems;
  }
  getItems() {
    return Array.from(this.hostElement.querySelectorAll("ix-breadcrumb-item"));
  }
  render() {
    var _a, _b, _c, _d;
    const a11y = a11yHostAttributes(this.hostElement);
    return h(Host, { key: "01b7b3c2b8e5b4eccea75ea1ffb85d91516888ab" }, h("ix-dropdown", { key: "acd5584e3cfcb2b698a36e65a9f706f955f525e7", id: this.previousDropdownId, "aria-label": this.ariaLabelPreviousButton, trigger: ((_a = this.items) === null || _a === void 0 ? void 0 : _a.length) > this.visibleItemCount ? this.previousButtonRef : null, onShowChanged: ({ detail }) => {
      this.isPreviousDropdownExpanded = detail;
      const previousButton = this.hostElement.shadowRoot.getElementById(this.previousButtonId);
      if (previousButton) {
        forceUpdate(this.hostElement.shadowRoot.getElementById(this.previousButtonId));
      }
    } }, this.items.slice(0, this.items.length - this.visibleItemCount).map((item) => {
      var _a2;
      const label = (_a2 = item.label) !== null && _a2 !== void 0 ? _a2 : item.innerText;
      return h("ix-dropdown-item", { label, onClick: () => {
        this.onItemClick(label);
      }, onItemClick: (event) => event.stopPropagation() });
    })), ((_b = this.items) === null || _b === void 0 ? void 0 : _b.length) > this.visibleItemCount ? h("ix-breadcrumb-item", { id: this.previousButtonId, ref: (ref) => this.previousButtonRef = ref, label: "...", tabIndex: 1, onItemClick: (event) => event.stopPropagation(), "aria-describedby": this.previousDropdownId, "aria-controls": this.previousDropdownId, "aria-expanded": a11yBoolean(this.isPreviousDropdownExpanded), class: "previous-button" }) : null, h("nav", { key: "5528a34e56c4dbcf8130652b517ca717c3158294", class: "crumb-items", "aria-label": (_c = a11y["aria-label"]) !== null && _c !== void 0 ? _c : "breadcrumbs" }, h("ol", { key: "5e74629e99a27aad5140a0bf519db8513adfc5ff" }, h("slot", { key: "4cf1e9f67ca27bd9f8f6e06e6e6a946048306f78" }))), h("ix-dropdown", { key: "f16070f4edffdef90c32e8f426e492d8b856f5ef", trigger: this.nextButtonRef }, (_d = this.nextItems) === null || _d === void 0 ? void 0 : _d.map((item) => h("ix-dropdown-item", { label: item, onClick: (e) => {
      this.nextClick.emit({
        event: e,
        item
      });
    }, onItemClick: (event) => event.stopPropagation() }))));
  }
  get hostElement() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "nextItems": ["onNextItemsChange"]
    };
  }
};
Breadcrumb.style = IxBreadcrumbStyle0;
export {
  Breadcrumb as ix_breadcrumb
};
