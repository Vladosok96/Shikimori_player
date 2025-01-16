const API_URL = 'https://anime.bytie.moe'

function onFormLoaded(title_list, response, body) {
    title_list.innerHTML = '';

    if (response.result.length > 0) {
        // player window
        let player = document.getElementById('player_block');
        if (player == null) {
            player = document.createElement('div');
            player.className = 'player';
            player.id = 'player_block';
            body.prepend(player);
        }

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
        for (let i = 0; i < response.result.length; i++) {
            const item = response.result[i];

            const element = document.createElement('li');
            title_list.appendChild(element);
            
            const element_link = document.createElement('a');
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
    }
    else {
        const element_line_container_info = document.createElement('div');
        element_line_container_info.className = "line-container";
        
        const element_line_info = document.createElement('div');
        element_line_info.className = "line";
        element_line_info.textContent = 'Плееры не найдены:';
        element_line_container_info.appendChild(element_line_info);

        const element_line_update = document.createElement('div');
        element_line_update.className = 'b-link';
        element_line_update.textContent = 'обновить?';
        element_line_update.onclick = function() {requestPlayers(title_list);};
        element_line_container_info.appendChild(element_line_update);

        title_list.appendChild(element_line_container_info);
    }
}


function requestPlayers(title_list) {
    try {
        const form = document.querySelector('.b-db_entry > .c-image > .b-user_rate');
        if (form == null) {
            return false;
        }

        const body = document.body;
        if (body == null) {
            return false;
        }

        const data = JSON.parse(form.getAttribute('data-entry'));
        
        console.log('try to request: ' + `${API_URL}/ext/search_by_id?shikimori_id=${data?.id}`);
        title_list.innerHTML = 'Загрузка...';

        if (data?.id != null) {
            fetch(`${API_URL}/ext/search_by_id?shikimori_id=${data?.id}`)
                .then((response) => response.json())
                .then((response) => onFormLoaded(title_list, response, body))
                .catch((e) => {
                    let response = {};
                    response['result'] = [];
                    onFormLoaded(title_list, response, body);
                });
            return true;
        }
    } catch (e) {
        console.warn('Invalid `data-entry` value ' + e);
    }
}

let initialized = null;

function loadPlayers() {
    const form = document.querySelector('.b-db_entry > .c-image > .b-user_rate');
    if (form == null) {
        return false;
    }

    const info_right = document.querySelector('.cc > .c-info-right');
    if (info_right == null) {
        return false;
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
    player_block.appendChild(player_links);

    info_right.appendChild(player_block);

    requestPlayers(title_list);
}

setTimeout(loadPlayers, 5000);
