const API_URL = 'https://anime.bytie.moe'

function onFormLoaded(info_right, response, watchUrl, body) {
    if (response.result.length > 0) {
        // player window
        const player = document.createElement('div');
        player.className = 'player';
        body.prepend(player);

        const inner = document.createElement('div');
        inner.className = 'player__inner';
        player.appendChild(inner);

        const iframe = document.createElement('iframe');
        
        inner.addEventListener('mousedown', (event) => {
            iframe.src = `https:${response.result[0]?.link}`;
            player.style.visibility = "hidden";
        })

        if (Array.isArray(response.result) && response.result.length > 0) {
            iframe.className = "player_iframe"
            iframe.src = `https:${response.result[0].link}`;
            iframe.frameBorder = 0;
            iframe.setAttribute('allowFullScreen', 'true');
            iframe.setAttribute('webkitallowfullscreen', 'true');
            iframe.setAttribute('mozallowfullscreen', 'true');
            inner.appendChild(iframe);
        } else {
            const message = document.createElement('label');
            message.textContent = 'No results';
            inner.appendChild(message);
        }

        // sources block
        const player_block = document.createElement('div');
        player_block.className = 'block';

        const subhead_line = document.createElement('div');
        subhead_line.className = 'subheadline';
        subhead_line.textContent = 'СМОТРЕТЬ ОНЛАЙН';
        player_block.appendChild(subhead_line);

        const player_links = document.createElement('div');
        player_links.className = 'block';
        
        const title_list = document.createElement('ul');
        player_links.appendChild(title_list);
        
        for (let i = 0; i < response.result.length; i++) {
            const item = response.result[i];

            const element = document.createElement('li');
            title_list.appendChild(element);
            
            const element_link = document.createElement('a');
            // element_link.href = watchUrl + `&position=${i}`;
            element_link.name = i.toString();
            element_link.textContent = `${item.translation.title} | ${item.translation.type}`;
            element_link.target = '_blank';
            element_link.rel = 'noopener noreferrer';

            element_link.addEventListener('mousedown', (event) => {
                iframe.src = `https:${response.result[event.target.name]?.link}`;
                player.style.visibility = "visible";
            })

            element.appendChild(element_link);

        }

        player_block.appendChild(player_links);

        info_right.appendChild(player_block);
    }
}

let initialized = null;

window.addEventListener('turbolinks:load', function () {
    const start = () => {
        const currentLocation = window.location.href

        if (initialized === currentLocation) {
            return true;
        }

        const watchMetaTag = document.querySelector('meta[name="shikimori-ext-url"]');
        const watchUrl = watchMetaTag?.content;
        if (watchUrl == null) {
            return false;
        }

        const form = document.querySelector('.b-db_entry > .c-image > .b-user_rate');
        if (form == null) {
            return false;
        }

        const info_right = document.querySelector('.cc > .c-info-right');
        if (info_right == null) {
            return false;
        }

        const body = document.body;
        if (body == null) {
            return false;
        }

        try {
            const data = JSON.parse(form.getAttribute('data-entry'));
            if (data?.id != null) {
                initialized = currentLocation;

                fetch(`${API_URL}/ext/search_by_id?shikimori_id=${data?.id}`)
                    .then((response) => response.json())
                    .then((response) => onFormLoaded(info_right, response, `${watchUrl}?id=${data?.id}`, body))
                    .catch((e) => {
                        showError(`Failed to load title info: ${e}`)
                    })
                return true;
            }
        } catch (e) {
            console.warn('Invalid `data-entry` value ' + e);
        }

        return false;
    }

    if (start()) {
        return
    }

    const observer = new MutationObserver(function (mutations, me) {
        start() && me.disconnect();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})
