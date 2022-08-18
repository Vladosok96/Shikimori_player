const API_URL = 'https://anime.bytie.moe'

function showError(root, error) {
    root.textContent = error
}

function onLoad(root, response, position) {
    document.title = response.result[0].title;

    const player = document.createElement('div');
    player.className = 'player';
    root.appendChild(player);

    const inner = document.createElement('div');
    inner.className = 'player__inner';
    player.appendChild(inner);

    // if (Array.isArray(response.result) && response.result.length > 0) {
    //     const label = document.createElement('div');
    //     label.className = 'title';
    //     label.textContent = `${response.result[position].title}`;
    //     inner.appendChild(label);

    //     const iframe = document.createElement('iframe');
    //     iframe.src = `https:${response.result[position].link}`;
    //     iframe.frameBorder = 0;
    //     iframe.setAttribute('allowFullScreen', 'true');
    //     iframe.setAttribute('webkitallowfullscreen', 'true');
    //     iframe.setAttribute('mozallowfullscreen', 'true');
    //     inner.appendChild(iframe);
    // } else {
    //     const message = document.createElement('label');
    //     message.textContent = 'No results';
    //     inner.appendChild(message);
    // }
}

function onInit(root) {
    const params = new URLSearchParams(window.location.search)
    const titleId = params.get('id')
    const position = params.get('position')
    if (titleId == null) {
        return showError(root, 'Unknown title id')
    }

    fetch(`${API_URL}/ext/search_by_id?shikimori_id=${titleId}`)
        .then((response) => response.json())
        .then((response) => {
            onLoad(root, response, position);
        })
        .catch((e) => {
            showError(`Failed to load title info: ${e}`)
        })
}

let initialized = false

window.addEventListener('load', function () {
    const start = () => {
        if (initialized) {
            return false;
        }

        const root = document.getElementById('root')
        if (root != null) {
            initialized = true
            onInit(root)
            return true
        } else {
            return false
        }
    }

    if (start()) {
        return
    }

    const observer = new MutationObserver(function (mutations, me) {
        start() && me.disconnect();
    });

    observer.observe(document, {
        childList: true, subtree: true
    });
})
