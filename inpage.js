const API_URL = 'https://anime.bytie.moe'

function onFormLoaded(info_right, response, watchUrl) {
    // const button = document.createElement('a');
    // button.className += 'shikimori-ext__button';
    // button.innerText = 'Watch';
    // button.href = watchUrl;
    // button.target = "_blank";

    // player_links = '<div class="block"><div class="subheadline">Студия</div><div class="block"><a href="https://shikimori.one/animes/studio/179-A-C-G-T" title="Аниме студии A.C.G.T."><img alt="Аниме студии A.C.G.T." class="studio-logo" src="https://dere.shikimori.one/system/studios/original/179.jpg?1388083492"></a></div></div>'
    
    if (response.result.length > 0) {
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
            element_link.href = watchUrl + `&position=${i}`;
            element_link.textContent = `${item.translation.title} | ${item.translation.type}`;
            element_link.target = '_blank';
            element_link.rel = 'noopener noreferrer';
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

        try {
            const data = JSON.parse(form.getAttribute('data-entry'));
            if (data?.id != null) {
                initialized = currentLocation;

                fetch(`${API_URL}/ext/search_by_id?shikimori_id=${data?.id}`)
                    .then((response) => response.json())
                    .then((response) => {
                        onFormLoaded(info_right, response, `${watchUrl}?id=${data?.id}`);
                    })
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
