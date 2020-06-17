chrome.runtime.onMessage.addListener(function (url, sender, onSuccess) {
  fetch(url)
    .then((response) => response.json())
    .then((responseText) => onSuccess(responseText))
    .catch((response) => response);

  return true; // Will respond asynchronously.
});

// var d;

// async function fetchAsync() {
//   let data = await (await fetch(url)).json();
//   d = data;
// }

// fetchAsync().then((response) => onSuccess(d));
