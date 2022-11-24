const getElements = () =>
  new Promise((resolve) =>
    chrome.storage.sync.get(["elements"], (elementsHash) => resolve(elementsHash.elements || {}))
  );


const sites = [
  { media: "instagram", url: "www.instagram.com" },
  { media: "twitter", url: "twitter.com" },
  { media: "youtube", url: "www.youtube.com" },
]

const features = [
  { media: "instagram", topic: "", xpath: "/html/banner" },
  { media: "instagram", topic: "Reels", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/section/nav[2]/div/div/div/div/div/div[3]" },
  { media: "instagram", topic: "Stories", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div[2]/section/main/div[1]/section/div[1]/div[2]" },
  { media: "instagram", topic: "Stories", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/section/main/div[1]/section/div/div[2]" },
  { media: "instagram", topic: "Explore", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[3]" },
  { media: "instagram", topic: "Messages", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[4]" },
  { media: "instagram", topic: "Messages", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/section/nav[2]/div/div/div/div/div/div[4]" },
  { media: "instagram", topic: "Notifications", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[5]" },
  { media: "instagram", topic: "Suggestions", xpath: "/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/div[1]/div[2]/section/main/div[1]/section/div[3]/div[2]" },

  { media: "youtube", topic: "Shorts", xpath: "/html/body/ytd-app/div[1]/tp-yt-app-drawer/div[2]/div/div[2]/div[2]/ytd-guide-renderer/div[1]/ytd-guide-section-renderer[1]/div/ytd-guide-entry-renderer[2]/a" },
  { media: "youtube", topic: "Shorts", xpath: "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-rich-grid-renderer/div[6]/ytd-rich-section-renderer" },
  { media: "youtube", topic: "Shorts", xpath: "/html/body/ytd-app/div[1]/ytd-mini-guide-renderer/div/ytd-mini-guide-entry-renderer[2]/a" },
  { media: "youtube", topic: "Explore", xpath: "/html/body/ytd-app/div[1]/tp-yt-app-drawer/div[2]/div/div[2]/div[2]/ytd-guide-renderer/div[1]/ytd-guide-section-renderer[3]" },
  { media: "youtube", topic: "Home", xpath: "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]" },
  { media: "youtube", topic: "Notifications", xpath: "/html/body/ytd-app/div[1]/div/ytd-masthead/div[3]/div[3]/div[2]/ytd-notification-topbar-button-renderer/yt-icon-button" },


  { media: "twitter", topic: "Explore", xpath: "/html/body/div[1]/div/div/div[2]/header/div/div/div/div[1]/div[2]/nav/a[2]" },

]


chrome.webNavigation.onCompleted.addListener(async () => {

  const getActiveTabs = () =>
    new Promise((resolve) =>
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs))
    );

  const elements = await getElements();
  const [tab] = await getActiveTabs();
  const currentHost = new URL(tab.url).hostname;

  for (const site of sites) {
    if (site.url === currentHost) {
      actions_user = Object.entries(elements)
      topicsToOff = actions_user.find((media) => media[0] === site.media)[1]
      for (const topic of topicsToOff) {
        features_user = Object.entries(features.filter((f) => (f.media == [site.media] && f.topic == [topic])))
        for (const feature of features_user) {
          deleteItem(tab, feature[1].xpath)
        }
      }
    }
  }

});


const deleteItem = (tab, xpath) => {

  function changeDisplayNoneByXpath(xpath) {
    document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = 'none';
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: changeDisplayNoneByXpath,
      args: [xpath]
    }
  );

}
