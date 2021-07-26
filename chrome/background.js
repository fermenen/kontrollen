const getElements = () =>
  new Promise((resolve) =>
    chrome.storage.sync.get(["elements"], (elementsHash) => resolve(elementsHash.elements || {}))
  );

chrome.webNavigation.onCompleted.addListener(async () => {
  const elements = await getElements();

  const getActiveTabs = () =>
    new Promise((resolve) =>
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs))
    );

  const [tab] = await getActiveTabs();
  const currentHost = new URL(tab.url).hostname;
  const rules = elements[currentHost];
  if (!rules) return;

  for (const rule of rules) {
    if (rule.kind === "1") applyKind1(tab, rule);
    else if (rule.kind === "2") applyKind2(tab, rule);
    else if (rule.kind === "3") applyKind3(tab, rule);
  }
});

const applyKind1 = (tab, { selector, extraInfo }) => {
  const toRemoveClasses = extraInfo
    .split(";")
    .map((klass) => `"${klass}"`)
    .join(",");

  chrome.tabs.executeScript(tab.id, {
    code: `document.querySelectorAll("${selector}").forEach(node => node.classList.remove(${toRemoveClasses}))`,
  });
};

const applyKind2 = (tab, { selector, extraInfo }) => {
  const toAddClasses = extraInfo
    .split(";")
    .map((klass) => `"${klass}"`)
    .join(",");

  chrome.tabs.executeScript(tab.id, {
    code: `document.querySelectorAll("${selector}").forEach(node => node.classList.add(${toAddClasses}))`,
  });
};

const applyKind3 = (tab, { selector, extraInfo }) => {
  chrome.tabs.executeScript(tab.id, {
    code: `document.querySelectorAll("${selector}").forEach(node => node.style.cssText = "${extraInfo}")`,
  });
};
