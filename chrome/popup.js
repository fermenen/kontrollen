const getElements = () =>
  new Promise((resolve) =>
    chrome.storage.sync.get(["elements"], (elementsHash) => resolve(elementsHash.elements || {}))
  );

const saveElements = (elements) =>
  new Promise((resolve) => chrome.storage.sync.set({ elements }, () => resolve()));


const actions = [
  { id: "instagramExplore", media: "instagram", topic: "Explore" },
  { id: "instagramReels", media: "instagram", topic: "Reels" },
  { id: "instagramStories", media: "instagram", topic: "Stories" },
  { id: "instagramMessages", media: "instagram", topic: "Messages" },
  { id: "instagramNotifications", media: "instagram", topic: "Notifications" },
  { id: "instagramSuggestions", media: "instagram", topic: "Suggestions" },
  { id: "youtubeShorts", media: "youtube", topic: "Shorts" },
  { id: "youtubeExplore", media: "youtube", topic: "Explore" },
  { id: "youtubeHome", media: "youtube", topic: "Home" },
  { id: "youtubeNotifications", media: "youtube", topic: "Notifications" },
  { id: "twitterExplore", media: "twitter", topic: "Explore" },
]


const initialize = async () => {

  // Events to switch ui
  for (const action of actions) {
    document.getElementById(action.id).addEventListener("click", async (evt) => {
      clickTopic(action.id, action.media, action.topic)
    });
  }
  // Switch as user save
  for (const media of Object.entries(await getElements())) {
    const source = media[0]
    for (const feature of media[1]) {
      const idHtml = actions.find((a) => (a.media == [source] && a.topic == [feature])).id
      document.getElementById(idHtml).checked = false;
    }
  }

}


initialize();


const clickTopic = async (id, media, topic) => {
  checked = document.getElementById(id).checked;
  checked ? removeTopic(id, media, topic) : addTopic(id, media, topic);
}


const addTopic = async (id, media, topic) => {
  elements = await getElements()
  if (elements[media] == undefined) {
    newElements = { ...elements, [media]: [topic] }
  } else {
    newElements = { ...elements, [media]: [...elements[media], topic] }
  }
  saveElements(newElements);
}


const removeTopic = async (id, media, topic) => {
  elements = await getElements();
  elements[media] = elements[media].filter((t) => t !== topic)
  saveElements(elements);
}

